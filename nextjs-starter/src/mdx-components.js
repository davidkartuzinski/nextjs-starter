// import Image from 'next/image';

export function useMDXComponents(components) {
  return {
    // Custom components
    // Nextjs Image component
    // Image,
    // Use the default components with any custom components you provide
    ...components,
    // You can customize any default components here
    h1: (props) => (
      <h1
        className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 mt-8'
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        className='scroll-m-20 text-3xl font-semibold tracking-tight mb-3 mt-6'
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className='scroll-m-20 text-2xl font-semibold tracking-tight mb-2 mt-4'
        {...props}
      />
    ),
    p: (props) => <p className='leading-7 mb-4' {...props} />,
    a: (props) => (
      <a
        className='font-medium text-primary underline underline-offset-4'
        {...props}
      />
    ),
    ul: (props) => (
      <ul className='my-6 ml-6 list-disc [&>li]:mt-2' {...props} />
    ),
    ol: (props) => (
      <ol className='my-6 ml-6 list-decimal [&>li]:mt-2' {...props} />
    ),
    li: (props) => <li {...props} />,
    blockquote: (props) => (
      <blockquote
        className='mt-6 border-l-2 pl-6 italic'
        {...props}
      />
    ),
    code: (props) => (
      <code
        className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'
        {...props}
      />
    ),
    pre: (props) => (
      <pre
        className='mb-4 mt-4 overflow-x-auto rounded-lg border bg-black p-4'
        {...props}
      />
    ),
    // Add custom image component with responsive styling
    // DON'T USE THIS COMPONENT, USE THE NEXTJS IMAGE COMPONENT INSTEAD
    img: (props) => (
      <img
        className='rounded-md my-6 max-w-full h-auto'
        alt={props.alt || ''}
        {...props}
      />
    ),
  };
}
