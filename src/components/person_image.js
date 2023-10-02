import axios from "axios";
import { useEffect, useState } from "react";
import { useFamilySearchData } from "@/hooks/use-familysearch-data";
import { parseJWT } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

const PersonImage = ({ pid, imageHeight, imageWidth, gender }) => {
  //default image will be a loading wheel until a response comes from API call
  const [image, setImage] = useState("https://i.stack.imgur.com/kOnzy.gif");

  const { accessToken } = useAuth();

  useEffect(() => {
    const parsedToken = parseJWT(accessToken).fs_access_token;

    //build the URL and Headers needed to fetch the person's profile picture.
    const url =
      "https://api.familysearch.org/platform/tree/persons/" + pid + "/portrait";

    const headers = {
      Accept: "application/x-fs-v1+json",
      Authorization: "Bearer " + parsedToken,
      "X-Expect-Override": "200-ok",
    };

    //fetch the profile Image from familySearch
    const res = axios
      .get(url, { headers: headers })
      .then((res) => {
        // check if there was a url for an image returned.
        if (res.headers.location) {
          setImage(res.headers.location);
        } else {
          //set the defualt profile icon based of the person's gender in familySearch
          if (gender.toLowerCase() === "female") {
            setImage("/female_icon.png");
          } else {
            setImage("/male_icon.png");
          }
        }
      })
      .catch((err) => {
        //set the defualt profile icon based of the person's gender in familySearch
        if (gender.toLowerCase() === "female") {
          setImage("/female_icon.png");
        } else {
          setImage("/male_icon.png");
        }
        console.log(err);
      });
  }, [accessToken, gender, pid]);

  return (
    <>
      {/* This will display a profile image from familySearch or the default profile icon based on gender */}
      <Image
        src={image}
        height={imageHeight}
        width={imageWidth}
        style={{ borderRadius: "50%" }}
        alt="Profile Image of Ancestor"
      />
    </>
  );
};

export { PersonImage };
