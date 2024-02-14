import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Private(props) {
  const loggedData = useContext(UserContext);

  return loggedData.loggedUser !== null ? (
    <props.Component />
  ) : (
    <Navigate to={`${BACKEND_URL}/login`} />
  );
}

export default Private;
