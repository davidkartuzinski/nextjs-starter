'use client';

import socials from './socials.js';

export default function SocialFollowMe() {
  return (
    <div
      aria-label='Follow Me on Social Media'
      className='flex justify-center'
    >
      <ul className='flex gap-4'>
        {socials.map(({ id, url, title, icon, css }) => (
          <li key={id}>
            <a
              title={title}
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-2xl transition-colors duration-300 hover:opacity-80'
              style={{ color: `var(${css})` }}
            >
              {icon}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
