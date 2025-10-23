-- Enable RLS and create read policies for all business type tables

-- Hotel table
ALTER TABLE public."Hotel" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to Hotel"
ON public."Hotel"
FOR SELECT
USING (true);

-- Bakery table
ALTER TABLE public."Bakery" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to Bakery"
ON public."Bakery"
FOR SELECT
USING (true);

-- Supermarket table
ALTER TABLE public."Supermarket" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to Supermarket"
ON public."Supermarket"
FOR SELECT
USING (true);

-- Hardware table
ALTER TABLE public."Hardware" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to Hardware"
ON public."Hardware"
FOR SELECT
USING (true);

-- Stationery table
ALTER TABLE public."Stationery" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to Stationery"
ON public."Stationery"
FOR SELECT
USING (true);

-- Clothing table
ALTER TABLE public."Clothing" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to Clothing"
ON public."Clothing"
FOR SELECT
USING (true);