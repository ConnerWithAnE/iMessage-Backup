
import '../../App.css';
import ContactList from "./ContactList"; 
import ContactPane from "./ContactPane";

export default function ContactPage() {


  return (
    <div className='flex h-[85vh]'>
    <div className='grid grid-cols-8 gap-2'>
      <div className='col-span-2'>
      <ContactList />
      </div>
      <div className='col-span-6'>
      <ContactPane />
      </div>
    </div>
    </div>
  )

}