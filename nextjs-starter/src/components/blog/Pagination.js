import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  isQueryParam = false,
}) {
  // Generate page numbers array
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Function to generate the URL for a page
  const getPageUrl = (page) => {
    if (isQueryParam) {
      // If the basePath already contains a query parameter
      if (basePath.includes('?')) {
        if (basePath.includes('page=')) {
          return basePath.replace(/page=\d+/, `page=${page}`);
        } else {
          return `${basePath}&page=${page}`;
        }
      } else {
        return `${basePath}&page=${page}`;
      }
    } else {
      return `${basePath}?page=${page}`;
    }
  };

  return (
    <div className='flex justify-center'>
      <nav
        className='flex items-center space-x-1'
        aria-label='Pagination'
      >
        {/* Previous page button */}
        {currentPage > 1 ? (
          <Button variant='outline' size='icon' asChild>
            <Link href={getPageUrl(currentPage - 1)}>
              <ChevronLeft className='h-4 w-4' />
              <span className='sr-only'>Previous page</span>
            </Link>
          </Button>
        ) : (
          <Button variant='outline' size='icon' disabled>
            <ChevronLeft className='h-4 w-4' />
            <span className='sr-only'>Previous page</span>
          </Button>
        )}

        {/* Page numbers */}
        {pageNumbers.map((number) => (
          <Button
            key={number}
            variant={currentPage === number ? 'default' : 'outline'}
            size='icon'
            asChild={currentPage !== number}
          >
            {currentPage !== number ? (
              <Link href={getPageUrl(number)}>{number}</Link>
            ) : (
              number
            )}
          </Button>
        ))}

        {/* Next page button */}
        {currentPage < totalPages ? (
          <Button variant='outline' size='icon' asChild>
            <Link href={getPageUrl(currentPage + 1)}>
              <ChevronRight className='h-4 w-4' />
              <span className='sr-only'>Next page</span>
            </Link>
          </Button>
        ) : (
          <Button variant='outline' size='icon' disabled>
            <ChevronRight className='h-4 w-4' />
            <span className='sr-only'>Next page</span>
          </Button>
        )}
      </nav>
    </div>
  );
}
