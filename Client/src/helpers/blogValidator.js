export const blogValidator = ({ title, content, description, thumbnail, category }) => {
    let errors = [];

    if(title.trim().length < 10) {
        errors.push("Title has at least 10 characters.");
    }else if(title.trim().length > 50) {
        errors.push("Title is up to 50 characters long.");
    }

    if(content.trim().length < 2000) {
        errors.push("Content has at least 2000 characters.");
    }

    if(description.trim().length < 50) {
        errors.push("Description has at least 50 characters.");
    }else if(description.trim().length > 200) {
        errors.push("Description is up to 200 characters long.");
    }

    if(!thumbnail) {
        errors.push("Thumbnail cannot be left blank.");
    }

    if(!category) {
        errors.push("Category cannot be left blank.");
    }

    return errors;
}