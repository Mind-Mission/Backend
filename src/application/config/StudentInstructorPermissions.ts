import { InstructorPermissions } from "./InstructorPermissions";
import { StudentPermissions } from "./StudentPermissions";

export const StudentInstructorPermissions: any[] = [...StudentPermissions];

StudentInstructorPermissions.forEach(permission => {
  const instructorPermission = InstructorPermissions.find(({resource}) => resource === permission.resource);
  permission.cruds = instructorPermission?.cruds || permission.cruds;
});
const resources = StudentInstructorPermissions.map(({resource}) => resource)
const instructorPermissions = InstructorPermissions.filter(({resource}) => !resources.includes(resource));
StudentInstructorPermissions.push(...instructorPermissions);