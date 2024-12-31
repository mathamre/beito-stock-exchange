import AddBusinessForm from "@/components/AddBusinessForm";

export default function Home() {
  return (

    <main className={'p-4 m-0 h-full w-full flex flex-row'}>
        <div className={'bg-gray-100 w-full h-full p-4 rounded-md'}>
            <AddBusinessForm />
        </div>
    </main>
  );
}
