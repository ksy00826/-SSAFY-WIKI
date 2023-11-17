package com.bdos.ssafywiki.discussion.service;

import com.bdos.ssafywiki.discussion.dto.DiscussionDto;
import com.bdos.ssafywiki.discussion.entity.Discussion;
import com.bdos.ssafywiki.discussion.mapper.DiscussionMapper;
import com.bdos.ssafywiki.discussion.repository.DiscussionRepository;
import com.bdos.ssafywiki.document.entity.Document;
import com.bdos.ssafywiki.document.repository.DocumentRepository;

import com.bdos.ssafywiki.redis.service.RedisSubscriber;
import com.bdos.ssafywiki.user.entity.User;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class DiscussionService {
    private final RedisTemplate<String, DiscussionDto> redisTemplateMessage;
    private final DiscussionRepository discussionRepository;

    // 쪽지방(topic)에 발행되는 메시지 처리하는 리스너


    // 대화 저장
    private final DiscussionMapper discussionMapper;
    private final DocumentRepository documentRepository;


    public void saveMessage(DiscussionDto discussionDto, User user) {
        // DB 저장
        Discussion discuss = discussionMapper.toDiscussion(discussionDto);
        Document document = documentRepository.findById(discussionDto.getDocsId()).orElseThrow(() -> new NotFoundException("Docs Not Found"));
        discuss.setUserAndDocument(user, document);
        discussionRepository.save(discuss);

        // 1. 직렬화
        redisTemplateMessage.setValueSerializer(new Jackson2JsonRedisSerializer<>(DiscussionDto.class));

        // 2. redis 저장
        redisTemplateMessage.opsForList().rightPush(discussionDto.getDocsId().toString(), discussionDto);

        // 3. expire 을 이용해서, Key 를 만료시킬 수 있음
        redisTemplateMessage.expire(discussionDto.getDocsId().toString(), 10, TimeUnit.MINUTES);
    }

    // 6. 대화 조회 - Redis & DB
    public List<DiscussionDto> loadMessage(Long docsId) {
        List<DiscussionDto> messageList = new ArrayList<>();

        // Redis 에서 해당 채팅방의 메시지 100개 가져오기
        redisTemplateMessage.setValueSerializer(new Jackson2JsonRedisSerializer<>(DiscussionDto.class));
        List<DiscussionDto> redisMessageList = redisTemplateMessage.opsForList().range(docsId.toString(), -10000, -1);

        // 4. Redis 에서 가져온 메시지가 없다면, DB 에서 메시지 1000개 가져오기
        if (redisMessageList == null || redisMessageList.isEmpty()) {
            // 5.
            List<Discussion> dbMessageList = discussionRepository.findAllByDocumentIdOrderByCreatedAtAsc(docsId);
            log.info(dbMessageList.toString());
            for (Discussion discussion : dbMessageList) {
                DiscussionDto discussionDto = discussionMapper.toDto(discussion);
                messageList.add(discussionDto);
                redisTemplateMessage.setValueSerializer(new Jackson2JsonRedisSerializer<>(DiscussionDto.class));      // 직렬화
                redisTemplateMessage.opsForList().rightPush(docsId.toString(), discussionDto);                                // redis 저장
            }
        } else {
            // 7.
            messageList.addAll(redisMessageList);
        }

        return messageList;
    }



}