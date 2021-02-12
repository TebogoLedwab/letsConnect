import { AuthService } from "./../../providers/auth.service";
import { CommunityService } from "./../../providers/community.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ToastService } from "src/app/providers/toast.service";
import { HttpClient } from "@angular/common/http";
import { ModalDirective } from "angular-bootstrap-md";
import { Community } from "src/app/models/data-type";

@Component({
  selector: "app-community",
  templateUrl: "./community.component.html",
  styleUrls: ["./community.component.scss"]
})
export class CommunityComponent implements OnInit {
  @ViewChild("addPostModal", { static: true }) addPostModal: ModalDirective;
  currentUser: any;
  comms: Community[];
  allComs: Community[];
  newTags: string;

  newComm = {
    title: "",
    tags: [],
    content: "",
    image: ""
  };

  constructor(
    public auth: AuthService,
    private httpClient: HttpClient,
    private communityService: CommunityService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.getAllComms();

    if (this.auth.isUserLoggedIn()) {
      this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    }
    this.communityService.getAllComms().subscribe(data => {
      this.allComs = data;
      this.comms = this.allComs;
    });
  }

  // on handle filter logics
  handle_filter(event) {
    if (event == "newest") {
      this.comms = this.allComs.sort((a, b) => {
        return (
          new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime()
        );
      });
    }

    if (event == "oldest") {
      this.comms = this.allComs.sort((a, b) => {
        return (
          new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
        );
      });
    }

    if (event == "unanswered") {
      let newComms = this.allComs.filter(function (comm) {
        return comm.comments.length == 0;
      });

      this.comms = newComms;
    }
  }

  // handle search logics
  handle_search(event) {
    if (event == "") {
      // If empty show all
      this.comms = this.allComs;
    } else {
      // Else filter
      var newComms = this.comms.filter(function (comm) {
        return comm.title.toLowerCase().includes(event.toLowerCase()); // make all to lowercase 'cause it's case sensitive
      });

      this.comms = newComms;
    }
  }

  getAllComms() {
    this.communityService.getAllComms().subscribe(
      data => {
        this.comms = data;
      },
      error => {
        if (error) {
          this.toast.danger("Error", error.error.errors[0].msg);
        }
      }
    );
  }

  addTags(event) {
    this.newComm.tags = event.target.value.split(" ").filter(x => x);;
  }

  postComm() {
    this.communityService.postComm(this.newComm).subscribe(
      data => {
        console.log(data);
        this.getAllComms();

        this.toast.success("Success", "Posted Successfully");
        this.addPostModal.hide();

        this.newComm = {
          title: "",
          tags: [],
          content: "",
          image: ""
        };

      },

      error => {
        if (error) {
          this.toast.danger("Error", error.error.errors[0].msg);
        }
      }
    );
  }
}
