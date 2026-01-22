import { PAGE_SIZE } from "../utils/constants";
import { getToday } from "../utils/helpers";
import supabase from "./supabase";

export async function getBookings({ filter, sortBy, page }) {
  // const { data, error } = await supabase
  let query = supabase
    .from("bookings")
    .select(
      "id,created_at,endDate,startDate,numNights,numGuests,status,totalPrice,cabins(name),guests(fullName,email)",
      { count: "exact" },
    );

  if (filter) query = query.eq(filter.field, filter.value);
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });
  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }
  const { data, error, count } = await query;

  ///Sort
  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }
  return { data, count };
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    // .select('*')
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`,
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*),guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }
  return data;
}

export async function createBooking(newBooking) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }
  return data;
}

export async function getAvailableCabins(startDate, endDate) {
  // 1. Get all bookings in the date range
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("cabinId")
    .or(`and(startDate.lte.${endDate},endDate.gte.${startDate})`);

  if (error) {
    console.error(error);
    throw new Error("Could not check availability");
  }

  // 2. Get all cabins
  const { data: cabins, error: cabinsError } = await supabase
    .from("cabins")
    .select("*");

  if (cabinsError) {
    console.error(cabinsError);
    throw new Error("Could not load cabins");
  }

  // 3. Filter out unavailable cabins
  const unavailableCabinIds = bookings.map((booking) => booking.cabinId);
  const availableCabins = cabins.filter(
    (cabin) => !unavailableCabinIds.includes(cabin.id),
  );

  return availableCabins;
}

export async function checkCabinAvailability(cabinId, startDate, endDate) {
  const { data, error } = await supabase
    .from("bookings")
    .select("id")
    .eq("cabinId", cabinId)
    .or(`and(startDate.lte.${endDate},endDate.gte.${startDate})`)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Could not check cabin availability");
  }

  return !data; // Returns true if available (no booking found), false otherwise
}
