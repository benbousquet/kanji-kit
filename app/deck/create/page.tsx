import CreateForm from "./_components/createForm";



export default function Create() {
  return (
    <div className="flex flex-col items-center max-w-fit lg:max-w-7xl mx-auto ">
        <h1 className="text-4xl lg:text-6xl">Create Deck</h1>
      <CreateForm />
    </div>
  );
}
