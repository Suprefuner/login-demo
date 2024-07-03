import customFetch from "../axios/axios";
import Btn from "../components/Btn";
import useUser from "../hooks/useUser";

export default function DashboardAdminPage() {
  const { users, setUsers } = useUser()

  const getAllUsers = async () => {
    try {
      const { data } = await customFetch('/user/all')
      if (data.users.length) {
        setUsers(data.users)
      }
    } catch (err) {
      console.log(err);
    }
  }

  const updateUserRole = async (id: string) => {
    try {
      const { data } = await customFetch.patch(`/user/${id}`)

      const updatedUsers = users.map( user =>
        user._id === id ? data.user : user
      )

      setUsers(updatedUsers)
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-xl font-bold">
        Admin dashboard page
      </h2>

      <div>
        <Btn
          type="button"
          label="Get all users"
          onClick={getAllUsers}
          className="w-fit"
        />
      </div>

      {!!users.length && (
        <ul className="border rounded-lg overflow-hidden">
          <li className="grid grid-cols-[300px,100px] p-4 bg-gray-200">
            <span>Email</span>
            <span className="text-center">Role</span>
          </li>

          {users.map(user => (
            <li key={user._id} className="grid grid-cols-[300px,100px] items-center px-4 py-2">
              <span className="">
                {user.email}
              </span>
              <Btn
                type="button"
                label={user.role}
                onClick={() => updateUserRole(user._id)}
                className="w-full !mt-0 py-2 bg-transparent text-black hover:bg-gray-200"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}