import axios from "axios";
import { useEffect, useState } from "react";

import { columns, LeaveButtons } from "../../utils/LeaveHelpers";
import DataTable from "react-data-table-component";

function Table() {
  const [leaves, setLeaves] = useState(null);

  const [filteredLeaves, setFilteredLeaves] = useState(null);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(
        "https://ems-backend-phi.vercel.app/api/leave",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);

      if (response.data.success) {
        let sno = 1;
        const data = await response.data.leaves.map((leave) => ({
          _id: leave._id,
          sno: sno++,
          employeeId: leave.employeeId.employeeId,
          name: leave.employeeId.userId.name,
          leaveType: leave.leaveType,
          department: leave.employeeId.department.dep_name,
          days:
            new Date(leave.endDate).getDate() -
            new Date(leave.startDate).getDate(),
          status: leave.status,
          action: <LeaveButtons Id={leave._id} />,
        }));
        setLeaves(data);
        setFilteredLeaves(data);
      }
    } catch (error) {
      console.log(error);
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const filterByInput = (e) => {
    const data = leaves.filter((leave) =>
      leave.employeeId
        .toString()
        .toLowerCase()
        .includes(e.target.value.toLowerCase())
    );
    console.log(data, "filter");

    setFilteredLeaves(data);
  };

   const filterByButton = (status) => {
     const data = leaves.filter((leave) =>
       leave.status
         .toString()
         .toLowerCase()
         .includes(status.toLowerCase())
     );
     console.log(data, "filter");

     setFilteredLeaves(data);
   };

  return (
    <>
      {filteredLeaves ? (
        <div className="p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold">Manage Leaves</h3>
          </div>
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search By Emp Id"
              className="px-4 py-0.5 border"
              onChange={filterByInput}
            />
            <div className="space-x-3">
              <button className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700"
               onClick={()=>filterByButton("Pending")}
              >
                Pending
              </button>
              <button className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700"
               onClick={()=>filterByButton("Rejected")}
              >
                Rejected
              </button>
              <button className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700"
              onClick={()=>filterByButton("Approved")}
              >
                Approved
              </button>
            </div>
          </div>

          <div className="mt-3">
            <DataTable
              columns={columns}
              data={filteredLeaves}
              pagination
              center={true}
            />
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default Table;
