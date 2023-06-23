export const imageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lzw2klqh");
    formData.append("cloud_name", "meddev");

    const res = await fetch("https://api.cloudinary.com/v1_1/meddev/upload", {
        method: "POST",
        body: formData
    })

    const data = await res.json();
    return { public_id: data.public_id, url: data.secure_url };
}