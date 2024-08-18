
import '../../App.css'
import { HiOutlineChat } from 'react-icons/hi';
import { PiAddressBook } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { useSelectedTab } from '../../contexts/SelectedTab.context';


export default function Sidebar() {

    const {selectedTab, setSelectedTab} = useSelectedTab();

    return (
        <div className='flex flex-col text-lg text-purple-800 pt-5'>
            <Link to={`/list`} className={`flex items-center p-3  rounded-e-xl ${selectedTab === 'messages' ? 'bg-slate-200' : 'hover:bg-slate-100'}`} onClick={() => setSelectedTab('messages')}>
                <div className='ml-3 mr-2 text-3xl'><HiOutlineChat /></div>
                <div className='hidden sm:block text-left'>Messages</div>
            </Link>
            <Link to={`/contacts`} className={`flex items-center p-3  rounded-e-xl ${selectedTab === 'contacts' ? 'bg-slate-200' : 'hover:bg-slate-100'}`} onClick={() => setSelectedTab('contacts')}>
                <div className='ml-3 mr-2 text-3xl'><PiAddressBook /></div>
                <div className='hidden sm:block text-left'>Contacts</div>
            </Link>
        </div>
    )
}