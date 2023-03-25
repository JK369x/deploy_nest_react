// import { db } from '../../firebase/config_firebase';
// import { addDoc, setDoc, doc, deleteDoc, } from "firebase/firestore";
// import { CourseCollection } from '../../firebase/createCollection'

// import { useAppDispatch, useAppSelector } from '../../store/useHooksStore'
// import { Lookup, typeCourseOnline_Onside } from '../../types/type';

// export interface TypeCourses {
//     title: string,
//     subtitle: string,
//     description: string,
//     category: Lookup | null,
//     start_register: Date | any,
//     start_registerEnd: Date | any,
//     start_register_time: Date | any,
//     start_register_end: Date | any,
//     start_course: Date | any,
//     end_course: Date | any,
//     course_date?: string,
//     course_date_time: string | null,
//     course_status?: Lookup[],
//     what_will_student_learn_in_your_course: {
//         input_0: string,
//         input_1: string,
//         input_2?: string,
//         input_3?: string,
//     },
//     the_course_consists: {
//         input_0: string,
//         input_1: string,
//         input_2?: string,
//         input_3?: string,
//     },
//     who_is_this_course: string,
//     linkteammeeting: string,
//     whataretherequirement: string,
//     image: string,
//     teaching_assistant?: string,
//     Pricing: number,
//     pricing: number,
//     create_by_name: string,
//     Approval: boolean,
//     min_people: string,
//     image_create: string,
//     // queue_people: {

//     // }
// }

// export const UseCreateCourse = () => {
//     const { uid, status, displayName, photoURL } = useAppSelector(({ auth }) => auth);
//     const dispatch = useAppDispatch()
//     const addCourse = async (params: TypeCourses) => {
//         try {
//             let newdata: any = params
//             let pricingNumber = Number(newdata.Pricing)
//             delete newdata.Pricing
//             // console.log(typeof(params.Pricing))

//             await setDoc(doc(CourseCollection), {
//                 ...newdata,
//                 create_by_name: displayName,
//                 create_by_id: uid,
//                 pricing: pricingNumber,
//                 timestamp: new Date(),
//                 approval: false,
//                 image_create: photoURL,
//             })


//         } catch (err) {
//             console.log(err)
//         }
//         return { addCourse }
//     }
// }
