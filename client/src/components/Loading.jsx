import { CircularProgress } from "@mui/material";

function Loading() {
  return (
    <div className="w-[100vw] h-[100vh] bg-primary flex justify-center items-center">
      <CircularProgress color={"secondary"} />
    </div>
  );
}

export default Loading