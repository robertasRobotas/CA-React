import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import { useParams } from "react-router-dom";

import { getLessonById } from "../../api/lessons";
import { Lesson } from "../../types/lesson";
import MonacoCodeEditor from "../../components/MonacoCodeEditor/MonacoCodeEditor";
import { EditorProvider } from "../../components/MonacoCodeEditor/EditorContext/EditorContext";
import CodeRenderer from "../../components/MonacoCodeEditor/CodeRenderer/CodeRenderer";
import { Box, Typography } from "@mui/material";
import styles from "./Main.module.scss";

export default function LoginPage() {
  const [task, setTask] = useState<Lesson>();
  const { id } = useParams();

  const [userInfo] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  const retrieveTask = async (id: string) => {
    const fetchedTasks = await getLessonById(id);
    setTask(fetchedTasks.data.task);
  };

  useEffect(() => {
    retrieveTask(id!);
  }, []);

  return (
    <Box minHeight={"100vh"}>
      <Header isUserLoggedIn={userInfo.email} name={userInfo.name} />
      <Box height={"100%"} padding={1} className={styles.taskDescription}>
        {task && <Typography>{task.title_en}</Typography>}
      </Box>
      <EditorProvider>
        <Box padding={1} display={"flex"}>
          <MonacoCodeEditor />
          <CodeRenderer />
        </Box>
      </EditorProvider>
    </Box>
  );
}
