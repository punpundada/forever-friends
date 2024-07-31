import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ManageUserActions from "./ManageUserActions";
export type UserTable = {
  id: string;
  name: string;
  email: string;
  adoptionCenterId: number | null;
  role: "ADMIN" | "USER" | "SUPER_ADMIN" | "EMPLOYEE";
  isBanned: boolean;
};

type props = {
  users: UserTable[];
};
const ManageUserList = (props: props) => {
  if (props.users.length <= 0) {
    return <></>;
  }
  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Active</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>is Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.isBanned ? "Banned" : "Active"}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <ManageUserActions user={user} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ManageUserList;
