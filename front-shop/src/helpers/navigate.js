import { useNavigate, useParams } from "react-router-dom";
import React from "react";

function NavigateComponent({ Component }) {
  const navigate = useNavigate();
  const params = useParams();

  return <Component navigate={navigate} params={params} />;
}

export default NavigateComponent;
