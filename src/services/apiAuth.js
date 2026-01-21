import supabase, { supabaseUrl } from "./supabase";
export async function signup({ fullname, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullname,
        avatar: "",
      },
    },
  });
  return data;
}
///

///

///
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  console.log(data);
  return data;
}
///

///

///
export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  return data?.user;
}
///

///

///
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
///

///

///

// export async function updateCurrentUser({ password, fullname, avatar }) {
//   let updateData;
//   if (password) updateData = { password };
//   if (fullname) updateData = { ...updateData, data: { fullname } };

//   const { data, error } = await supabase.auth.updateUser(updateData);
//   if (error) throw new Error(error.message);
//   if (!avatar) return data;
//   const fileName = `avatar-${data.user.id}-${Math.random()}`;
//   const { error: storageError } = await supabase.storage
//     .from("avatars")
//     .upload(fileName, avatar);
//   if (storageError) throw new Error(storageError.message);
//   const { data: updateUser, error: error2 } = await supabase.auth.updateUser({
//     data: { ...data.user.user_metadata,
//       avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
//     },
//   });
//   if (error2) throw new Error(error2.message);
//   return updateUser;
// }
export async function updateCurrentUser({ password, fullname, avatar }) {
  let updateData = {};

  // Handle password
  if (password) updateData.password = password;

  // Handle avatar upload first if needed
  let avatarUrl = null;
  if (avatar) {
    const { data: userData } = await supabase.auth.getUser();
    const fileName = `avatar-${userData.user.id}-${Math.random()}`;

    const { error: storageError } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatar);

    if (storageError) throw new Error(storageError.message);

    avatarUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;
  }

  // Build user metadata update
  const metadataUpdate = {};
  if (fullname) metadataUpdate.fullname = fullname;
  if (avatarUrl) metadataUpdate.avatar = avatarUrl;

  // Add metadata to updateData if there's anything to update
  if (Object.keys(metadataUpdate).length > 0) {
    updateData.data = metadataUpdate;
  }

  // Single update call
  const { data, error } = await supabase.auth.updateUser(updateData);
  if (error) throw new Error(error.message);

  return data;
}
