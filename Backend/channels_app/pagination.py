from rest_framework.pagination import PageNumberPagination

class MessagePagination(PageNumberPagination):
    page_size = 20  # Adjust this value as needed
    page_size_query_param = 'page_size'
    max_page_size = 100
    def get_paginated_response(self, data):
        # Get the original paginated response
        response = super().get_paginated_response(data)
        
        # Modify the `next` and `previous` fields to contain only page numbers
        if response.data.get('next'):
            # Extract the page number from the full URL
            next_url = response.data['next']
            page_number = self.extract_page_number(next_url)
            response.data['next'] = page_number
        
        if response.data.get('previous'):
            # Extract the page number from the full URL
            prev_url = response.data['previous']
            page_number = self.extract_page_number(prev_url)
            response.data['previous'] = page_number
        
        return response
    
    def extract_page_number(self, url):
        # Extract the page number from the URL
        from urllib.parse import urlparse, parse_qs
        parsed_url = urlparse(url)
        page_number = parse_qs(parsed_url.query).get('page', [None])[0]
        return page_number



class ConversationPagination(PageNumberPagination):
    page_size = 12  # Customize page size
    page_size_query_param = 'page_size'  # Allow client to control page size
    max_page_size = 100  # Maximum page size limit
    def get_paginated_response(self, data):
        # Get the original paginated response
        response = super().get_paginated_response(data)
        
        # Modify the `next` and `previous` fields to contain only page numbers
        if response.data.get('next'):
            # Extract the page number from the full URL
            next_url = response.data['next']
            page_number = self.extract_page_number(next_url)
            response.data['next'] = page_number
        
        if response.data.get('previous'):
            # Extract the page number from the full URL
            prev_url = response.data['previous']
            page_number = self.extract_page_number(prev_url)
            response.data['previous'] = page_number
        
        return response
    
    def extract_page_number(self, url):
        # Extract the page number from the URL
        from urllib.parse import urlparse, parse_qs
        parsed_url = urlparse(url)
        page_number = parse_qs(parsed_url.query).get('page', [None])[0]
        return page_number