**This is a wip**

# iMessage-Backup

This application is intented to backup iMessage (and hopefully one day Android) chats.

Current steps for running:
1. Run idevicebackup2 to backup IOS device.
2. Grab files: Manifest.db, Addressbook.db (31bb7ba8914766d4ba40d6dfb6113c8b614be442) and SMS.db (3d0d7e5fb2ce288813306e4d4636395e047a3d28) from the backup
3. Name them: Manifest.db, Addressbook.db and chat.db.
4. Place these files in the data folder.
5. In `initialDBSetup.ts` alter the backupDir to point to your idevicebackup
6. run npm install in both the server and web folders
7. run `nest start` to start the backend server and `npm run dev` to start the frontend
8. navigate to `localhost:3000/attachments/test` to copy the chat data to the backup db
9. Upon completion navigate to `localhost:5173/list` to see chats.

This does not use the attributedBody but needs to, a plist parser must be added.


## Notable Mention

- [ReagentX's imessage-exporter](https://github.com/ReagentX/imessage-exporter) as a point of reference for the plist and the underlying functions of iMessage

