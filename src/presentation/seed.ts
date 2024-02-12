import { CorrectAnswer, LessonType, QuestionLevel } from "@prisma/client";
import slugify from "slugify"
import prisma from "../domain/db"

const courses = [
  {
    title: "NodeJS - The Complete Guide (MVC, REST APIs, GraphQL, Deno)",
    shortDescription: "In this course, we will learn what is the nodejs and how it handle js code outside the browser",
    description: "In this course, we will learn what is the nodejs and how it handle js code outside the browser using its build-in libraries like http, libuv and the others",
    language: "EN",
    level: "BEGINNER",
    imageCover: "https://localhost.com/img.png",
    requirements: ["HTML", "CSS", "JS"],
    courseTeachings: ["Work with one of the most in-demand web development programming languages", "Build modern, fast and scalable server-side web applications with NodeJS, databases like SQL or MongoDB and more", "Get a thorough introduction to DenoJS", "Learn the basics as well as advanced concepts of NodeJS in great detail", "Understand the NodeJS ecosystem and build server-side rendered apps, REST APIs and GraphQL APIs"],
    price: 300,
    hours: 46,
    articles: 2,
    lectures: 2,
    quizzes: 1,
    sections: [
      {
        title: 'Section 1 - Introduction',
        description: 'This section is an introduction to Nodejs',
        lessons: [
          {
            title: 'Introduction',
            isFree: true,
            attachment: '',
            lessonType: LessonType.VIDEO,
            video: {
              title: "Welcome to this Node.js course! Let me introduce myself and give you a rough overview of this course and what it's all about!",
              description: '',
              url: 'http://www.youtube.com/watch',
              time: 5,
            }
          },
          {
            title: 'What is Nodejs',
            isFree: false,
            attachment: '',
            lessonType: LessonType.VIDEO,
            video: {
              title: "What is Node.js? That's the most important question in a Node course I'd argue and in this lecture, we'll explore what exactly NodeJS is and why it's amazing.",
              description: '',
              url: 'http://www.youtube.com/watch',
              time: 10,
            }
          },
          {
            title: 'This is lesson title for a free article',
            isFree: true,
            attachment: '',
            lessonType: LessonType.ARTICLE,
            article: {
              title: 'This is an article title',
              content: 'This is content',
              time: 6,
            }
          },
          {
            title: 'This is lesson title for a non free article',
            isFree: false,
            attachment: '',
            lessonType: LessonType.ARTICLE,
            article: {
              title: 'This is an article title for not free article',
              content: 'This is a content for not free article',
              time: 10,
            }
          },
          {
            title: 'This is a lesson title for free quiz',
            isFree: true,
            attachment: '',
            lessonType: LessonType.QUIZ,
            quiz: {
              title: 'This is a free quiz',
              description: '',
              time: 15,
              questions: [
                {
                  questionText: 'Question One',
                  choiceA: 'A',
                  choiceB: 'B',
                  choiceC: 'C',
                  choiceD: 'D',
                  correctAnswer: CorrectAnswer.choiceA,
                  level: QuestionLevel.EAZY
                },
                {
                  questionText: 'Question Two',
                  choiceA: 'A',
                  choiceB: 'B',
                  choiceC: 'C',
                  choiceD: 'D',
                  correctAnswer: CorrectAnswer.choiceB,
                  level: QuestionLevel.MEDIUM
                },
                {
                  questionText: 'Question Three',
                  choiceA: 'A',
                  choiceB: 'B',
                  choiceC: 'C',
                  choiceD: 'D',
                  correctAnswer: CorrectAnswer.choiceC,
                  level: QuestionLevel.HARD
                },
                {
                  questionText: 'Question Four',
                  choiceA: 'A',
                  choiceB: 'B',
                  choiceC: 'C',
                  choiceD: 'D',
                  correctAnswer: CorrectAnswer.choiceD,
                  level: QuestionLevel.ADVANCED
                },
              ]
            }
          },
        ]
      }
    ]
  },
  {
    title: "Fundamentals Course in .NET",
    shortDescription: "In this course, we will learn what is the .NET",
    description: "In this course, we will learn what is the .NET and What are the different packages in it",
    language: "EN",
    level: "BEGINNER",
    imageCover: "https://localhost.com/img.png",
    requirements: ["C#", "OOP", "LinQ"],
    courseTeachings: ["What is the .NET", "How .NET handle incoming requests"],
    price: 250,
  },
];

export const seeding = async () => {
  try {
    await prisma.category.create({
      data: {
        name: 'Programming',
        slug: 'programming',
        type: 'CATEGORY',
        description: "Unlock the world of coding and software development in our comprehensive Programming category. Whether you're a beginner eager to take your first steps into the realm of programming or an experienced developer aiming to refine your skills, our diverse range of courses has something for everyone",
        children: {
          create: {
            name: 'Web Development',
            slug: 'web-development',
            type: 'SUBCATEGORY',
            description: "Welcome to our Web Development subcategory, where the digital world comes to life through code. Whether you're dreaming of creating stunning websites, dynamic web applications, or robust e-commerce platforms, our Web Development courses empower you to turn your vision into reality.",
            children: {
              create: {
                name: 'Nodejs',
                slug: 'nodejs',
                type: 'TOPIC',
                description: 'Node.js is an open-source, cross-platform runtime environment that executes JavaScript code outside of a web browser. It allows developers to use JavaScript for server-side scripting, enabling the development of scalable and high-performance network applications.',
                courses: {
                  create: courses.map((course) => {
                    const {title, shortDescription, description, courseTeachings, imageCover, language, level, price, requirements, hours, articles, lectures, quizzes, sections} =course;
                    return {
                      title,
                      slug: slugify(title, {trim: true, lower: true}),
                      shortDescription,
                      description,
                      courseTeachings,
                      imageCover,
                      language,
                      level,
                      price,
                      requirements,
                      hours,
                      articles,
                      lectures,
                      quizzes,
                      isApproved: true,
                      isDraft: false,
                      publishedAt: new Date(),
                      instructor: {
                        connect: {
                          id: 1
                        }
                      },
                      sections: sections ? {
                        create: sections.map((section, index) => {
                          const {title, description, lessons} = section;
                          return {
                            title,
                            slug: slugify(title, {trim: true, lower: true}),
                            description,
                            order: index + 1,
                            lessons: {
                              create: lessons.map((lesson, index) => {
                                const {title, isFree, attachment, lessonType, article, quiz, video} = lesson;
                                return {
                                  title,
                                  slug: slugify(title, {trim: true, lower: true}),
                                  isFree,
                                  attachment,
                                  lessonType,
                                  order: index + 1,
                                  time: article?.time || video?.time || quiz?.time || 0,
                                  article: lessonType === 'ARTICLE' ? {
                                    create: {
                                      title: article?.title,
                                      content: article.content,
                                      time: article.time,
                                    }
                                  } : undefined,
                                  video: lessonType === 'VIDEO' ? {
                                    create: {
                                      title: video?.title,
                                      description: video.description,
                                      url: video?.url,
                                      time: video.time,
                                    }
                                  } : undefined,
                                  quiz: lessonType === 'QUIZ' ? {
                                    create: {
                                      title: quiz?.title,
                                      description: quiz.description,
                                      time: quiz.time,
                                      questions: {
                                        create: quiz.questions.map((question, index) => {
                                          return {
                                            questionText: question.questionText,
                                            choiceA: question.choiceA,
                                            choiceB: question.choiceB,
                                            choiceC: question.choiceC,
                                            choiceD: question.choiceD,
                                            correctAnswer: question.correctAnswer,
                                            order: index + 1,
                                            level: question.level
                                          }
                                        })
                                      }
                                    }
                                  } : undefined,
                                }
                              })
                            }
                          }
                        })
                      } : undefined
                    }
                  }) as any
                }
              }
            }
          }
          
        }
      }
    });
    console.log('DB has been seeded successfully ✅');
  }catch(error) {
    console.log(error);
  }
}