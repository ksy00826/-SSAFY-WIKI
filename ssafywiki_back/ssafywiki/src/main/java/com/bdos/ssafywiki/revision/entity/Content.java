package com.bdos.ssafywiki.revision.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EntityListeners(AuditingEntityListener.class)
@Table(name = "contents")
public class Content {
    @Id
    @Column(name = "content_id")
    private Long id;

    @Column(name = "content_text", columnDefinition = "TEXT")
    private String text;

    @CreationTimestamp
    @Column(name="content_created_at",  columnDefinition = "TIMESTAMP")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name="content_modified_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime modifiedAt;
}
