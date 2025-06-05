 const handleCreatePost = async ({content,image,token, setLoading}) => {
    // Later: Send to backend and refresh
    console.log("Created post:", content);
   
    try {
      const response = await fetch("http://localhost:8080/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({content,imageUrl:image})
      });

      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
      setPosts(data.content); 
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading;
    }
  
  };

  export default handleCreatePost;