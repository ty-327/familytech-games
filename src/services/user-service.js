import axios from 'axios';
import { parseJWT } from "@/lib/utils";
import Tree from '@/data/fsdatastructures';
import { Person } from '@/data/fsdatastructures';

export default class UserService {
  static getFamilySearchData = async (accessToken) => {
    const fsData = parseJWT(accessToken);
    const url = `https://api.familysearch.org/platform/tree/ancestry?person=${fsData.fs_user.pid}&generations=5&personDetails&marriageDetails=`;
    var familySearchData;
    await axios
      .get(url, {
        headers: { Authorization: `Bearer ${fsData.fs_access_token}` },
      })
      .then((res) => {
        familySearchData = {
          data: res.data,
          accessToken: fsData.fs_access_token,
          userPID: fsData.fs_user.pid,
        };
        return familySearchData;
      })
      .catch((err) => {
        console.log(err);
      });
      familySearchData = this.convertFamilySearchData(familySearchData);
    return familySearchData;
  };

  //convert fsdata to our own structure
  static convertFamilySearchData = (rawFSData) => {
    let newFSData = new Tree;

    if (rawFSData && rawFSData.data.persons) {
      for (var i in rawFSData.data.persons) {
        let person = new Person(rawFSData.data.persons[i]);
        newFSData.addPerson(person);
      }
    }
    newFSData.insertRelationships(rawFSData.data.relationships);
    return newFSData;
  }
}
