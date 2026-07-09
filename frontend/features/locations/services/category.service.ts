import axiosInstance from '@/lib/axiosInstance';



export interface Category {
  _id: string;
  label: string;
  value: string;
}

export interface CategoryPagination {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
  pagination: CategoryPagination;
}

export interface FetchCategoriesParams {
  q?: string;
  page?: number;
  limit?: number;
}

/**
 * GET /api/categories
 *
 * Fetches a paginated, optionally-searched page of business categories.
 *
 * @param params.q     - Partial search string matched against `label`
 * @param params.page  - 1-based page number (default: 1)
 * @param params.limit - Items per page (default: 30)
 */
export const fetchCategories = async ({
  q = '',
  page = 1,
  limit = 30,
}: FetchCategoriesParams = {}): Promise<CategoriesResponse> => {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  params.set('page', String(page));
  params.set('limit', String(limit));

  const response = await axiosInstance.get<CategoriesResponse>(
    `/api/categories?${params.toString()}`
  );
  return response.data;
};
