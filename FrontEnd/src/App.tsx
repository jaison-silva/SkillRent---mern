import { useForm } from "react-hook-form";

function App() {
  // function handleSubmit(e) {}
  const {register, handleSubmit} = useForm()
  return (
    <>
      <div>
        <h3>Hi, SignUp page !</h3>
        <div>
          <form onSubmit={handleSubmit((data) => console.log(data))}>
            <input {...register("email")} />
            <input {...register("password")} />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}
 
export default App;
