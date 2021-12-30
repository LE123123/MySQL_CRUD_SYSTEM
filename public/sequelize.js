document.querySelectorAll("#user-list tr").forEach((el) => {
  if (el.querySelector("td")?.textContent) {
    /* search id */
    const id = el.querySelector("td").textContent;

    /* select button */
    el.querySelectorAll("td > button")[0].addEventListener("click", () => {
      getComment(id);
    });

    /* delete button */
    el.querySelectorAll("td > button")[1].addEventListener("click", async () => {
      await axios.delete(`/users/${id}`);
      getUser(id);
    });
  }
});

/* 사용자 로딩 */
const getUser = async () => {
  try {
    const { data: users } = await axios.get("/users");
    const tbody = document.querySelector("#user-list tbody");
    tbody.innerHTML = "";
    users.map((user) => {
      const row = document.createElement("tr");
      row.addEventListener("click", () => {
        getComment(id);
      });

      let td = document.createElement("td");
      td.textContent = user.id;
      row.appendChild(td);
      td = document.createElement("td");
      td.textContent = user.name;
      row.appendChild(td);
      td = document.createElement("td");
      td.textContent = user.age;
      row.appendChild(td);
      td = document.createElement("td");
      td.textContent = user.married ? "기혼" : "미혼";
      row.appendChild(td);

      td = document.createElement("td");
      let button = document.createElement("button");
      button.textContent = "선택";
      td.appendChild(button);
      row.appendChild(td);
      td = document.createElement("td");
      button = document.createElement("button");
      button.textContent = "삭제";
      td.appendChild(button);
      row.appendChild(td);

      tbody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
  }
};

/* 댓글 로딩 */
const getComment = async (id) => {
  try {
    const { data: comments } = await axios.get(`/users/${id}/comments`);

    // console.log(comments);
    const tbody = document.querySelector("#comment-list tbody");
    tbody.innerHTML = "";
    comments.map((comment) => {
      /* 로우 셀 추가 */
      const row = document.createElement("tr");
      let td = document.createElement("td");
      td.textContent = comment.id;
      row.append(td);
      td = document.createElement("td");
      td.textContent = comment.User.name;
      row.append(td);
      td = document.createElement("td");
      td.textContent = comment.comment;
      row.append(td);
      const edit = document.createElement("button");
      edit.textContent = "수정";
      /* 수정 버튼을 클릭했다면 */
      edit.addEventListener("click", async () => {
        const newComment = prompt("바꿀 내용을 입력하세요.");
        if (!newComment) {
          return alert("내용을 반드시 입력하셔야 합니다.");
        }
        try {
          await axios.patch(`/comments/${comment.id}`, { comment: newComment });
          getComment(id);
        } catch (err) {
          console.error(err);
        }
      });
      const remove = document.createElement("button");
      remove.textContent = "삭제";
      remove.addEventListener("click", async () => {
        try {
          await axios.delete(`/comments/${comment.id}`);
          getComment(id);
        } catch (err) {
          console.error(err);
        }
      });

      td = document.createElement("td");
      td.appendChild(edit);
      row.appendChild(td);
      td = document.createElement("td");
      td.appendChild(remove);
      row.appendChild(td);
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
  }
};

/* 사용자 등록 시 */
document.getElementById("user-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = e.target.username.value;
  const age = e.target.age.value;
  const married = e.target.married.checked;

  if (!name) {
    return alert("이름을 입력하세요");
  }

  if (!age) {
    return alert("나이를 입력하세요");
  }

  try {
    await axios.post("/users", { name, age, married });
    getUser();
  } catch (err) {
    console.error(err);
  }

  e.target.username.value = "";
  e.target.age.value = "";
  e.target.married.checked = false;
});

/* 댓글 등록 시 */
document.getElementById("comment-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = e.target.userid.value;
  const comment = e.target.comment.value;

  if (!id) {
    return alert("아이디를 입력하세요");
  }
  if (!comment) {
    return alert("댓글을 입력하세요");
  }

  try {
    await axios.post("/comments", { id, comment });
    getComment(id);
  } catch (err) {
    console.error(err);
  }

  e.target.userid.value = "";
  e.target.comment.value = "";
});
