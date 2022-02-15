import Picker from 'emoji-picker-react';
import React from 'react';
import "./styles.scss";

export const Emoji = ({pickEmoji}) => {

  const onEmojiClick = (event, emojiObject) => {
    pickEmoji(emojiObject?.emoji);
  };

  return (
    <div className="emoji">
      <Picker onEmojiClick={onEmojiClick} />
    </div>
  );
};