import React from "react";
import { useUsers } from "../api/api";

function Users() {
  const { users, isLoading, isError, error, refetch } = useUsers();
  console.log(users);
  return (
    <div>
      <h2 className="text-center text-2xl font-bold">Customers List</h2>
    </div>
  );
}

export default Users;
