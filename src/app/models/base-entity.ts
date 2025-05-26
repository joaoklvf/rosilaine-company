export class BaseEntity {
  id?: string;
  createdDate = new Date();
  updatedDate = new Date();
  isDeleted? = false;
}