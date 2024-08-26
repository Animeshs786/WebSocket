import React, { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";

function FakeData() {
  const [fakePostData, setFakePostData] = useState([]);

  useEffect(() => {
    const generateFakeData = () => {
      const newPost = {
        postData: {
          postImage: faker.image.imageUrl(),
          title: faker.lorem.words(3),
          description: faker.lorem.sentence(),
        },
        userData: {
          userName: faker.person.fullName(),
          email: faker.internet.email(),
          mobile: faker.phone.number(),
          profileImage: faker.image.avatar(),
        },
      };

      setFakePostData((prevData) => [...prevData, newPost]);
      console.log(faker);
      return newPost;
    };
    console.log(generateFakeData());
  }, []);

  // Print all fake posts
  useEffect(() => {
    console.log(fakePostData);
  }, [fakePostData]);

  return (
    <div>
      <h1>Generated Fake Posts</h1>
      {fakePostData.map((post, index) => (
        <div key={index}>
          {/* <h2>{post.userName}</h2> */}
          {/* <p>{post.description}</p> */}
          {/* <img src={post.profileImage} alt={`${post.userName}'s avatar`} /> */}
          {/* <img src={post.postImage} alt="Post" /> */}
        </div>
      ))}
    </div>
  );
}

export default FakeData;
[
  {
    postData: {
      description:
        "Velit spiritus creo volubilis harum triumphus necessitatibus amplitudo.",
      postImage: "https://loremflickr.com/640/480",
      title: "ea ventus aestus",
    },
    userData: {
      email: "Chris30@yahoo.com",
      mobile: "(718) 286-4987-179",
      profileImage:
        "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/527.jpg",
      userName: "Doyle Zboncak",
    },
  },
];
