import supabase from "./supabase";

// Get all guests
export async function getGuests() {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .order("fullName");

  if (error) {
    console.error(error);
    throw new Error("Guests could not be loaded");
  }

  return data;
}

// Get a single guest by ID
export async function getGuest(id) {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest not found");
  }

  return data;
}

// Create a new guest
export async function createGuest(newGuest) {
  const { data, error } = await supabase
    .from("guests")
    .insert([newGuest])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

// Search guests by name or email
export async function searchGuests(query) {
  if (!query) return [];

  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .or(`fullName.ilike.%${query}%,email.ilike.%${query}%`)
    .order("fullName")
    .limit(10);

  if (error) {
    console.error(error);
    throw new Error("Guests could not be searched");
  }

  return data;
}

// Update a guest
export async function updateGuest(id, updatedGuest) {
  const { data, error } = await supabase
    .from("guests")
    .update(updatedGuest)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }

  return data;
}
