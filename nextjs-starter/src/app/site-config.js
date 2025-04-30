// site-config.js
import Image from 'next/image';

// Social Media Icons from Font Awesome 6 - https://react-icons.github.io/react-icons/icons/fa6/
import {
  FaXTwitter,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaDiscord,
} from 'react-icons/fa6';

export const SiteName = 'NextJS Starter';

// use this if you want to use a logo
export const Logo = (
  <Image
    src='/dummy_logo.png'
    alt='Logo'
    width={300}
    height={34}
    priority
  />
);

// export const Logo = ''; <--- use this if you don't want to use a logo

export const NavItems = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

export const FooterItems = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

// Put whichever icons you want - then create the objects in socials.js

// Social Media Links
export const TwitterUrl = 'https://twitter.com/';
export const LinkedInUrl = 'https://www.linkedin.com/in/';
export const GitHubUrl = 'https://github.com/';
export const DiscordUrl = 'https://discordapp.com/users/';
export const InstagramUrl = 'https://www.instagram.com/';

// Social Media Icons
export const TwitterIcon = FaXTwitter;
export const LinkedInIcon = FaLinkedin;
export const GithubIcon = FaGithub;
export const DiscordIcon = FaDiscord;
export const InstagramIcon = FaInstagram;
