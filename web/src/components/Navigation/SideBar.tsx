
import '../../App.css'
import { HiOutlineChat } from 'react-icons/hi';
import { PiAddressBook } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { useSelectedTab } from '../../contexts/SelectedTab.context';


export default function Sidebar() {

    const {selectedTab, setSelectedTab} = useSelectedTab();

    return (
        <div className='flex flex-col text-lg pt-5'>
            <Link to={`/list`} className={`flex items-center p-3 hover:bg-slate-100 rounded-e-xl ${selectedTab === 'messages' ? 'bg-slate-200' : ''}`} onClick={() => setSelectedTab('messages')}>
                <div className='mr-2 text-3xl'><HiOutlineChat /></div>
                <div className='text-left'>Messages</div>
            </Link>
            <div className='flex items-center p-3 hover:bg-slate-100 rounded-e-xl'>
                <div className='mr-2 text-3xl'><PiAddressBook /></div>
                <div className='text-left'>Contacts</div>
            </div>
        </div>
    )
}