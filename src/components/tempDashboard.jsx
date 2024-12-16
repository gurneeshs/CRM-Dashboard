import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { BASE_URL } from "../helper";

const TempDashboard = () => {
  const [tempappointments, settempAppointments] = useState([]);

  useEffect(() => {
    const fetchtempAppointments = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/v1/appointment/gettempall`,
          { withCredentials: true }
        );
        settempAppointments(data.appointments);
      } catch (error) {
        settempAppointments([]);
      }
    };
    fetchtempAppointments();
  }, []);

  // const handleUpdateStatus = async (appointmentId, status) => {
  //   try {
  //     const { data } = await axios.put(
  //       `${BASE_URL}/api/v1/appointment/update/${appointmentId}`,
  //       { status },
  //       { withCredentials: true }
  //     );
  //     setAppointments((prevAppointments) =>
  //       prevAppointments.map((appointment) =>
  //         appointment._id === appointmentId
  //           ? { ...appointment, status }
  //           : appointment
  //       )
  //     );
  //     toast.success(data.message);
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   }
  // };
  const handletempUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/v1/appointment/tempupdate/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      settempAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Hello ,</p>
                <h5>
                  {admin &&
                    `${admin.firstName} ${admin.lastName}`}{" "}
                </h5>
              </div>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Facilis, nam molestias. Eaque molestiae ipsam commodi neque.
                Assumenda repellendus necessitatibus itaque.
              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Appointments</p>
            <h3>1500</h3>
          </div>
          <div className="thirdBox">
            <p>Registered Doctors</p>
            <h3>10</h3>
          </div>
        </div>
        <div className="banner">
          <h5>Temp Appointments</h5>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Patient's Issue</th>
              </tr>
            </thead>
            <tbody>
              {tempappointments && tempappointments.length > 0
                ? tempappointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                      <td>{appointment.age}</td>
                      <td>{appointment.gender}</td>
                      <td>{appointment.phone}</td>
                      <td>
                        <select
                          className={
                            appointment.status === "Pending"
                              ? "value-pending"
                              : appointment.status === "Accepted"
                              ? "value-accepted"
                              : "value-rejected"
                          }
                          value={appointment.status}
                          onChange={(e) =>
                            handletempUpdateStatus(appointment._id, e.target.value)
                          }
                        >
                          <option value="Pending" className="value-pending">
                            Pending
                          </option>
                          <option value="Accepted" className="value-accepted">
                            Accepted
                          </option>
                          <option value="Rejected" className="value-rejected">
                            Rejected
                          </option>
                        </select>
                      </td>
                      <td>{appointment.issue}</td>
                    </tr>
                  ))
                : "No Appointments Found!"}
            </tbody>
          </table>

          {}
        </div>

      </section>
    </>
  );
};

export default TempDashboard;
