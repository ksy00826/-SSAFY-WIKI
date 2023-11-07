import React from "react";
import { useParams } from "react-router-dom";

import DocsNav from "./DocsNav";
import AuthorityForm from "components/Write/AuthorityForm";

import { getAuth, updateAuth, inviteUser, deleteUser } from "utils/DocsAuthApi";
import { openNotification } from "App";

const Authority = () => {
  const params = useParams();
  const [loading, setLoading] = React.useState(true);
  const [read, setRead] = React.useState();
  const [write, setWrite] = React.useState();
  const [users, setUsers] = React.useState();
  const [info, setInfo] = React.useState();

  const invite = (value) => {
    console.log(value);
    // 이메일이 존재하는 유저인지 체크하고 추가.
  };

  React.useEffect(() => {
    // 첫 랜더링시
    getAuth(params.docsId).then((response) => {
      console.log(response);
      setRead(response.read);
      setWrite(response.write);
      setUsers(response.users);
      setLoading(false);

      setInfo(response);
    });
  }, []);

  const handleUpdate = () => {
    // console.log("update", selectedRead, selectedWrite);
    // selected값이 변했는지 체크
    let flag1 = true;
    let flag2 = true;
    if (
      read === undefined ||
      read === info.read ||
      (read == 100 && info.read > 100)
    ) {
      setRead(info.read);
      flag1 = false;
    }
    if (
      write === undefined ||
      write === info.write ||
      (write == 100 && info.write > 100)
    ) {
      setWrite(info.write);
      flag2 = false;
    }

    // 바꼈다면 axios로 전송
    if (flag1 || flag2) {
      console.log("axios");
      updateAuth({
        docsId: params.docsId,
        read: read,
        write: write,
      }).then((response) => {
        console.log(response);
        setInfo(response);
        openNotification(
          "success",
          "권한 수정 완료",
          `${params.title}문서 권한이 수정되었습니다.`
        );
        return response;
      });
    } else return info;
  };

  const findAuthId = async () => {
    let response = await handleUpdate();

    if (response.read > 100) return response.read;
    if (response.write > 100) return response.write;
    return -1;
  };

  const handleInvite = (email) => {
    findAuthId().then((id) => {
      console.log(id);

      inviteUser({
        authId: id,
        email: email,
      }).then((response) => {
        setUsers([response, ...users]);
      });
    });
  };

  const handleDelete = (item) => {
    findAuthId().then((id) => {
      deleteUser({
        authId: id,
        userId: item.userId,
      }).then((response) => {
        console.log(response);
        setUsers(users.filter((user) => user.userId != item.userId));
      });
    });
  };

  return (
    <div>
      <h1>
        {params.title}{" "}
        <small style={{ fontWeight: "normal" }}>(문서 권한)</small>
      </h1>
      <DocsNav current="auth" />

      {!loading ? (
        <AuthorityForm
          modify={handleUpdate}
          selectedRead={read}
          setSelectedRead={setRead}
          selectedWrite={write}
          setSelectedWrite={setWrite}
          userList={users}
          handleInvite={handleInvite}
          handleDelete={handleDelete}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Authority;
