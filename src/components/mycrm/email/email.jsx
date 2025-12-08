import React, { useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "./email.css"
import { Button, Checkbox } from "@mui/material"
import { Col, Row } from "reactstrap"

const Email = () => {
  const [selectedEmail, setSelectedEmail] = useState("Sarju@kaiasoft.com")
  const [emails] = useState([
    {
      id: 1,
      sender: "Chandler Bing",
      subject: "Focused impactful open issues from the project of GitHub",
      avatar: "CB",
      isStarred: true,
      hasAttachment: false,
      time: "",
      isRead: false
    },
    {
      id: 2,
      sender: "Ross Geller",
      subject:
        "Hey Katy, Dessert soufflé tootsie roll soufflé carrot cake halvah jelly.",
      avatar: "RG",
      isStarred: false,
      hasAttachment: false,
      label: "cyan",
      time: "10:12 AM",
      isRead: false
    },
    {
      id: 3,
      sender: "Barney Stinson",
      subject:
        "Hey Katy, Soufflé apple pie caramels soufflé tiramisu bear claw.",
      avatar: "BS",
      isStarred: false,
      hasAttachment: true,
      label: "purple",
      time: "12:44 AM",
      isRead: true
    },
    {
      id: 4,
      sender: "Phoebe Buffay",
      subject: "Hey Katy, Tart croissant jujubes gummies macaroon icing sweet.",
      avatar: "PB",
      isStarred: true,
      hasAttachment: false,
      label: "green",
      time: "Yesterday",
      isRead: false
    },
    {
      id: 5,
      sender: "Ted Mosby",
      subject:
        "Hey Katy, I love Pudding cookie chocolate sweet tiramisu jujubes I love danish.",
      avatar: "TM",
      isStarred: false,
      hasAttachment: false,
      label: "purple",
      time: "Yesterday",
      isRead: false
    },
    {
      id: 6,
      sender: "Stacy Cooper",
      subject:
        "Hey Katy, I love danish. Cupcake I love carrot cake sugar plum I love.",
      avatar: "SC",
      isStarred: false,
      hasAttachment: false,
      label: "cyan",
      time: "5 May",
      isRead: true
    },
    {
      id: 7,
      sender: "Rachel Green",
      subject:
        "Hey Katy, Chocolate cake pudding chocolate bar ice cream bonbon lollipop.",
      avatar: "RG",
      isStarred: false,
      hasAttachment: false,
      label: "purple",
      time: "15 May",
      isRead: false
    },
    {
      id: 8,
      sender: "Grace Shelby",
      subject: "Hey Katy, Icing gummi bears ice cream croissant dessert wafer.",
      avatar: "GS",
      isStarred: false,
      hasAttachment: true,
      label: "red",
      time: "20 Apr",
      isRead: false
    },
    {
      id: 9,
      sender: "Jacob Frye",
      subject:
        "Hey Katy, Chocolate cake pudding chocolate bar ice cream Sweet.",
      avatar: "JF",
      isStarred: false,
      hasAttachment: false,
      label: "cyan",
      time: "25 Mar",
      isRead: true
    },
    {
      id: 10,
      sender: "Chandler Bing",
      subject: "Focused impactful open issues from the project of GitHub",
      avatar: "CB",
      isStarred: true,
      hasAttachment: false,
      time: "",
      isRead: false
    },
    {
      id: 11,
      sender: "Ross Geller",
      subject:
        "Hey Katy, Dessert soufflé tootsie roll soufflé carrot cake halvah jelly.",
      avatar: "RG",
      isStarred: false,
      hasAttachment: false,
      label: "cyan",
      time: "10:12 AM",
      isRead: false
    },
    {
      id: 12,
      sender: "Barney Stinson",
      subject:
        "Hey Katy, Soufflé apple pie caramels soufflé tiramisu bear claw.",
      avatar: "BS",
      isStarred: false,
      hasAttachment: true,
      label: "purple",
      time: "12:44 AM",
      isRead: true
    },
    {
      id: 13,
      sender: "Phoebe Buffay",
      subject: "Hey Katy, Tart croissant jujubes gummies macaroon icing sweet.",
      avatar: "PB",
      isStarred: true,
      hasAttachment: false,
      label: "green",
      time: "Yesterday",
      isRead: false
    },
    {
      id: 14,
      sender: "Ted Mosby",
      subject:
        "Hey Katy, I love Pudding cookie chocolate sweet tiramisu jujubes I love danish.",
      avatar: "TM",
      isStarred: false,
      hasAttachment: false,
      label: "purple",
      time: "Yesterday",
      isRead: false
    },
    {
      id: 15,
      sender: "Stacy Cooper",
      subject:
        "Hey Katy, I love danish. Cupcake I love carrot cake sugar plum I love.",
      avatar: "SC",
      isStarred: false,
      hasAttachment: false,
      label: "cyan",
      time: "5 May",
      isRead: true
    },
    {
      id: 16,
      sender: "Rachel Green",
      subject:
        "Hey Katy, Chocolate cake pudding chocolate bar ice cream bonbon lollipop.",
      avatar: "RG",
      isStarred: false,
      hasAttachment: false,
      label: "purple",
      time: "15 May",
      isRead: false
    },
    {
      id: 17,
      sender: "Grace Shelby",
      subject: "Hey Katy, Icing gummi bears ice cream croissant dessert wafer.",
      avatar: "GS",
      isStarred: false,
      hasAttachment: true,
      label: "red",
      time: "20 Apr",
      isRead: false
    },
    {
      id: 18,
      sender: "Jacob Frye",
      subject:
        "Hey Katy, Chocolate cake pudding chocolate bar ice cream Sweet.",
      avatar: "JF",
      isStarred: false,
      hasAttachment: false,
      label: "cyan",
      time: "25 Mar",
      isRead: true
    }
  ])

  const [checkedEmails, setCheckedEmails] = useState([])

  const toggleCheck = id => {
    setCheckedEmails(prev =>
      prev.includes(id) ? prev.filter(emailId => emailId !== id) : [...prev, id]
    )
  }

  const toggleStar = id => {
    console.log("Toggle star for email:", id)
  }

  return (
    <Row>
      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="px-2 p-md-0">
        <div className="email-header">
          <div className="email-selector">
            <span>Email : {selectedEmail}</span>
            <i className="fas fa-chevron-down ml-2" />
          </div>
        </div>

        <div className="email-container">
          <div className="email-sidebar">
            <div className="d-flex justify-content-center">
              <Button type="submit" variant="contained" color="primary" className="mb-3  w-100">
                Compose
              </Button>
            </div>

            <div className="sidebar-menu">
              <div className="menu-item active">
                <div style={{ flexGrow: 1 }}>
                  <i className="far fa-envelope mr-2" />
                  <span>Inbox</span>
                </div>
                <div>
                  <span className="badge">4</span>
                </div>
              </div>
              <div className="menu-item">
                <i className="far fa-paper-plane mr-2" />
                <span>Sent</span>
              </div>
              <div className="menu-item">
                <i className="far fa-file-alt mr-2" />
                <span>Draft</span>
              </div>
              <div className="menu-item">
                <div style={{ flexGrow: 1 }}>
                  <i className="far fa-star mr-2" />
                  <span>Starred</span>
                </div>
                <div>
                  <span className="badge">10</span>
                </div>
              </div>
              <div className="menu-item">
                <i className="far fa-circle mr-2" />
                <span>Spam</span>
              </div>
              <div className="menu-item">
                <i className="far fa-trash-alt mr-2" />
                <span>Trash</span>
              </div>
            </div>

            <div className="labels-section">
              <div className="labels-header">LABELS</div>
              <div className="label-item">
                <i className="fas fa-circle mr-2 text-success" />
                <span>Work</span>
              </div>
              <div className="label-item">
                <i className="fas fa-circle mr-2 text-primary" />
                <span>Company</span>
              </div>
              <div className="label-item">
                <i className="fas fa-circle mr-2 text-info" />
                <span>Important</span>
              </div>
              <div className="label-item">
                <i className="fas fa-circle mr-2 text-danger" />
                <span>Private</span>
              </div>
            </div>
          </div>

          <div className="email-main">
            <div className="email-toolbar">
              <div className="search-box">
                <i className="fas fa-search" />
                <input
                  type="text"
                  placeholder="Search mail"
                />
              </div>
              <div className="toolbar-actions">
                <i className="fas fa-sync-alt" />
                <i className="fas fa-ellipsis-v" />
              </div>
            </div>

            <div className="email-actions">
              <div className="action-buttons">
                <div>
                  <Checkbox
                    size="small"
                    sx={{
                      "&.Mui-checked": {
                        color: "#0478DC !important",
                      },
                      color: "#6b7280 !important",
                    }}
                    disableRipple
                  />
                </div>
                <div>
                  <i className="far fa-trash-alt" />
                </div>
                <div>
                  <i className="far fa-envelope" />
                </div>
                <div>
                  <i className="far fa-folder" />
                </div>
                <div>
                  <i class="far fa-tag"></i>
                </div>
              </div>
              <div className="pagination">
                <span className="mr-3">1-10 of 653</span>
                <i className="fas fa-chevron-left mr-3" />
                <i className="fas fa-chevron-right mr-2" />
              </div>
            </div>

            <div className="email-list">
              {emails.map(email => (
                <div
                  key={email.id}
                  className={`email-item ${email.isRead ? "read" : "unread"}`}
                >
                  <div>
                    <Checkbox
                      size="small"
                      sx={{
                        "&.Mui-checked": {
                          color: "#0478DC !important",
                        },
                        color: "#6b7280 !important",
                      }}
                      disableRipple
                      checked={checkedEmails.includes(email.id)}
                      onChange={() => toggleCheck(email.id)}
                    />
                  </div>
                  <div className="email-star" onClick={() => toggleStar(email.id)}>
                    <i
                      className={
                        email.isStarred ? "fas fa-star text-warning" : "far fa-star"
                      }
                    />
                  </div>
                  <div className="email-avatar">
                    <div className={`avatar avatar-${email.avatar.toLowerCase()}`}>
                      {email.avatar}
                    </div>
                  </div>
                  <div className="email-content">
                    <span className="email-sender">{email.sender}</span>
                    <span className="email-subject">{email.subject}</span>
                  </div>
                  <div className="email-meta">
                    {email.hasAttachment && (
                      <i className="fas fa-paperclip text-muted mr-2" />
                    )}
                    {email.label && (
                      <i
                        className={`fas fa-circle label-dot label-${email.label} mr-2`}
                      />
                    )}
                    <span className="email-time">{email.time}</span>
                  </div>
                  <div className="email-actions-right">
                    <i className="far fa-trash-alt" />
                    <i className="far fa-envelope" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Col>
    </Row>
  )
}

export default Email
