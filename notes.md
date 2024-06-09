## Chat to Messages

each chat has a chat id, lets say for example chat_id 37
each message has a message id as well, the chat_message_join table shows the correlation between message ids and chat ids.

So in the table each chat_id has many corresponding message_ids

37 | 2105
37 | 2106

Like that



What do we want for messages table

- ROWID
  - Custom 
- guid
- text
- handle_id
- attributeBody
- version
- type 
- service
- account
- account_guid
- date
- date_read
- date_delivered
- is_delivered
- is_finished
- is_emote
- is_from_me
- is_empty
- is_delayed
- is_auto_reply
- is_prepated
- is_read
- is_system_message
- is_sent
- had_dd_results
- is_service_message
- is_forward
- was_downgraded
- is_archive
- cache_has_attachments
- cache_roomnames
- was_data_deteced
- was_deduplicated
- is_audio_message
- is_played
- date_played
- item_type
- other_handle
- 