import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import styles from "./Main.module.scss";
import { useParams } from "react-router-dom";
import { getLessons } from "../../api/lessons";
import { Lesson } from "../../types/lesson";
import LessonsWrapper from "../../components/TasksWrapper/LessonsWrapper";
import Spinner from "../../components/Spinner/Spinner";
import { getCourseById } from "../../api/courses";
import { Course } from "../../types/course";
import Skill from "../../components/Skill/Skill";
import { getLatestCompletedLesson } from "../../api/progress";

export default function LoginPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [course, setCourse] = useState<Course>();
  const [lastCompletedlessonIdx, setLastCompletedLessonIdx] = useState(0);
  const { id: courseId } = useParams();

  const retrieveTasks = async (courseId: string) => {
    const fetchedLessons = await getLessons(courseId);
    setLessons(fetchedLessons.data.tasks);
  };

  const [userInfo] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  const getCourse = async () => {
    const response = await getCourseById(courseId!);
    setCourse(response.data.course);
  };

  const getUserCourseProgress = async () => {
    const response = await getLatestCompletedLesson({ courseId: course!.id });
    setLastCompletedLessonIdx(response.data.progress);
  };

  useEffect(() => {
    retrieveTasks(courseId!);
    getCourse();
  }, [courseId]);

  useEffect(() => {
    course && getUserCourseProgress();
  }, [course]);

  return (
    <div className={styles.container}>
      <Header isUserLoggedIn={userInfo.email} name={userInfo.name} />

      <div className={styles.wrapper}>
        <div>
          <h2 className={styles.mobileTitle}>{course?.title}</h2>

          {lessons ? (
            <LessonsWrapper
              lessons={lessons}
              lastCompletedlessonIdx={lastCompletedlessonIdx}
            />
          ) : (
            <Spinner />
          )}
        </div>
        <div className={styles.course}>
          <h2 className={styles.title}>{course?.title}</h2>
          <p className={styles.description}>{course?.description}</p>
          <div className={styles.skillsWrapper}>
            {course?.skills.map((skill) => (
              <Skill key={skill} title={skill} />
            ))}
          </div>
          <img className={styles.cover} src={course?.imgUrl} />
        </div>
      </div>
    </div>
  );
}
