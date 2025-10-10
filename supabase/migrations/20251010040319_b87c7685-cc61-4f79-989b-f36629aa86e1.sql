-- Create restaurants table
CREATE TABLE public.restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cell_id TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  long DOUBLE PRECISION NOT NULL,
  raw_score NUMERIC NOT NULL,
  score NUMERIC NOT NULL,
  rank INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view restaurants"
ON public.restaurants
FOR SELECT
USING (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Authenticated users can insert restaurants"
ON public.restaurants
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to update
CREATE POLICY "Authenticated users can update restaurants"
ON public.restaurants
FOR UPDATE
USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to delete
CREATE POLICY "Authenticated users can delete restaurants"
ON public.restaurants
FOR DELETE
USING (auth.role() = 'authenticated');

-- Create index for lat/long queries (useful for geospatial lookups)
CREATE INDEX idx_restaurants_location ON public.restaurants(lat, long);

-- Create index for cell_id (if used for lookups)
CREATE INDEX idx_restaurants_cell_id ON public.restaurants(cell_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_restaurants_updated_at
BEFORE UPDATE ON public.restaurants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();