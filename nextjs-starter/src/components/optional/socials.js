import {
  DiscordUrl,
  GitHubUrl,
  InstagramUrl,
  LinkedInUrl,
  TwitterUrl,
} from '../../app/site-config';

import {
  DiscordIcon,
  GithubIcon,
  LinkedInIcon,
  TwitterIcon,
  InstagramIcon,
} from '../../app/site-config';

const Socials = [
  {
    id: 1,
    label: 'Twitter',
    url: TwitterUrl,
    title: 'Follow Me on Twitter',
    icon: <TwitterIcon size='25' />,
  },
  {
    id: 2,
    label: 'GitHub',
    url: GitHubUrl,
    title: 'Follow Me on GitHub',
    icon: <GithubIcon size='25' />,
  },
  {
    id: 3,
    label: 'LinkedIn',
    url: LinkedInUrl,
    title: 'Follow Me or Connect on LinkedIn',
    icon: <LinkedInIcon size='25' />,
  },
  {
    id: 4,
    label: 'Discord',
    url: DiscordUrl,
    title: 'Connect on Discord',
    icon: <DiscordIcon size='25' />,
  },
  {
    id: 5,
    label: 'Instagram',
    url: InstagramUrl,
    title: 'Follow Me on Instagram',
    icon: <InstagramIcon size='25' />,
  },
];

export default Socials;
