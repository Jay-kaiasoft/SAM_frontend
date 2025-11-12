import React from "react";
import { siteURL } from "../../config/api";

const PostPreview = ({
    optionsStatus,
    data,
    dataFaceBook,
    dataLinkedIn,
    dataTwitter,
    viewSelected,
    captions,
    user,
    videoThumbnaiLin,
    videoThumbnailFb,
    videoThumbnailTwt
}) => {
    return (
        <div>
            {optionsStatus.facebook && <div className="sm-pv-post sm-pv-post-facebook">
                <h6 className="sm-pv-post-title">
                    <i className="fab fa-facebook"></i> Facebook
                </h6>
                <div className="sm-post-list-wrap w-100">
                    <div className="sm-post-wrap">
                        <div className={`sm-post-wrap-facebook ${viewSelected === 1 ? "w-100" : "w-75"}`}>
                            <div className="sm-pv-facebook-header">
                                <div className="sm-post-avatar-wrap-facebook">
                                    <div className="sm-post-accountImage-facebook">
                                        <div data-char="" className="sm-post-accountImage-wrap">
                                            <img src={dataFaceBook.img} alt="facebook" />
                                        </div>
                                    </div>
                                </div>
                                <span className="sm-post-name-facebook">{dataFaceBook.name}</span>
                                <div className="sm-post-dt-facebook">just now</div>
                            </div>
                            <div className="white-space-pre-line" dangerouslySetInnerHTML={{ __html: captions.facebook }}></div>
                            {
                                (data.smPostImage !== "" && data.smPostImage.split(",").length > 0) &&
                                <div className="sm-pv-media-facebook">
                                    <div className="sm-pv-images-facebook" style={{ backgroundImage: `url(${siteURL}/easdrive/${user.memberId}/images/socialmedia/${data.smPostImage.split(",")[0]})` }}>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                        {
                                            data.smPostImage.split(",").map((image, index) => {
                                                if (index > 0 && index < 4) {
                                                    return <img className={`${data.smPostImage.split(",").length >= 4 ? "sm-pv-images-facebook-multiple" : "sm-pv-images-facebook"} `} src={`"${siteURL}/easdrive/${user.memberId}/images/socialmedia/${image}"`} key={index} alt="facebook-preview" />
                                                }
                                                else
                                                    return null
                                            })
                                        }
                                        {
                                            data.smPostImage.split(",").length > 4 &&
                                            <div className="images-quantity-text-container">{`+${data.smPostImage.split(",").length - 4}`}</div>
                                        }
                                    </div>
                                </div>
                            }
                            {
                                (data.smPostVideoFacebook !== "") &&
                                <div className="sm-pv-video-media-facebook">
                                    <img className="sm-pv-video-facebook" src={videoThumbnailFb} alt="facebook-preview" />
                                </div>
                            }
                            <div className="sm-pv-facebook-controls">
                                <div className="sm-pv-share-controls">
                                    <div className="sm-pv-share-controls-IconWrap"
                                        style={{ backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48cGF0aCBkPSJNMTcgN2gtNHYtMi41YzAtMS4zMi0xLjA2Mi0zLjUtMy0zLjVhMS41IDEuNSAwIDAgMC0xLjUgMS41djIuNWE1Ljc3MiA1Ljc3MiAwIDAgMS0xLjU0IDQuMzEyIDEuNjY2IDEuNjY2IDAgMCAwLTEuNjI3LTEuMzEyaC0yLjY2NmExLjY2NyAxLjY2NyAwIDAgMC0xLjY2NyAxLjY2N3Y3LjY2N2ExLjY2NyAxLjY2NyAwIDAgMCAxLjY2NyAxLjY2NmgyLjY2NmExLjY2MSAxLjY2MSAwIDAgMCAxLjU5MS0xLjIgMS42ODQgMS42ODQgMCAwIDAgLjc3Ni4yaDUuM2E2IDYgMCAwIDAgMy42LTEuMiA2IDYgMCAwIDAgMi40LTQuOHYtM2EyIDIgMCAwIDAtMi0yem0tMTEgMTAuMzMzYS42NjcuNjY3IDAgMCAxLS42NjcuNjY3aC0yLjY2NmEuNjY3LjY2NyAwIDAgMS0uNjY3LS42Njd2LTcuNjY2YS42NjcuNjY3IDAgMCAxIC42NjctLjY2N2gyLjY2NmEuNjY3LjY2NyAwIDAgMSAuNjY3LjY2N3ptMTItNS4zMzNhNSA1IDAgMCAxLTUgNWgtNS4zYS43LjcgMCAwIDEtLjctLjd2LTUuNzI3Yy45MTUtLjYzMyAyLjUtMi4yMTMgMi41LTUuNTczdi0yLjVhLjUuNSAwIDAgMSAuNS0uNWMxLjI0IDAgMiAxLjYxOSAyIDIuNXYzLjVoNWExIDEgMCAwIDEgMSAxeiIvPjwvc3ZnPg==")' }}>
                                    </div>
                                    Like
                                </div>
                                <div className="sm-pv-share-controls">
                                    <div className="sm-pv-share-controls-IconWrap"
                                        style={{ backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48cGF0aCBkPSJNMTIgMy40MTRsNS41ODYgNS41ODYtNS41ODYgNS41ODZ2LTMuMTA2bC0xLjA3NS4wOGExMi4xNzQgMTIuMTc0IDAgMCAwLTcuNzMyIDMuMzU2IDkuMzYxIDkuMzYxIDAgMCAxIDcuOTE2LTcuODY2bC44OTEtLjF2LTMuNTM2bS0xLTIuNDE0djUuMDU2Yy01LjA1My41NTItOSA1LjI0NC05IDEwLjk0NCAwIC4zNDEuMDE5LjY3Ny4wNDYgMS4wMWExMC45OTQgMTAuOTk0IDAgMCAxIDguOTU0LTUuNDUzdjQuNDQzbDgtOC04LTh6Ii8+PC9zdmc+")' }}>
                                    </div>
                                    Share
                                </div>
                                <div className="sm-pv-share-controls">
                                    <div className="sm-pv-share-controls-IconWrap"
                                        style={{ backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48cGF0aCBkPSJNMTQgM2EzIDMgMCAwIDEgMyAzdjVhMyAzIDAgMCAxLTMgM2gtNC4wNjVsLTMuOTM1IDMuMzEydi0zLjMxMmgtMWEzIDMgMCAwIDEtMy0zdi01YTMgMyAwIDAgMSAzLTNoOW0wLTFoLTlhNCA0IDAgMCAwLTQgNHY1YTQgNCAwIDAgMCA0IDR2My42YS40LjQgMCAwIDAgLjQwNi40LjQuNCAwIDAgMCAuMjgyLS4xMTlsNC42MTItMy44ODFoMy43YTQgNCAwIDAgMCA0LTR2LTVhNCA0IDAgMCAwLTQtNHoiLz48L3N2Zz4=")' }}>
                                    </div>
                                    Comment
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            {optionsStatus.twitter && <div className="sm-pv-post sm-pv-post-twitter">
                <h6 className="sm-pv-post-title sm-pv-post-title">
                    <i className="eas eas-twitter-x"></i> Twitter
                </h6>
                <div className="sm-post-list-wrap w-100">
                    <div className="sm-post-wrap">
                        <div className={`sm-post-wrap-twitter ${viewSelected === 1 ? "w-100" : "w-75"}`}>
                            <div className="sm-post-avatar-wrap-twitter">
                                <div className="sm-post-accountImage-twitter">
                                    <div data-char="" className="sm-post-accountImage-wrap">
                                        <img src={dataTwitter.img} alt="twitter" />
                                    </div>
                                </div>
                            </div>
                            <div className="sm-pv-twitter-header">
                                <span className="sm-post-name-twitter">{dataTwitter.name}</span>
                                <span className="sm-post-username-facebook">@{dataTwitter.screenName}</span>
                                <span className="sm-post-dt-twitter">now</span>
                            </div>
                            <div className="white-space-pre-line" dangerouslySetInnerHTML={{ __html: captions.twitter }}></div>
                            {
                                (data.smPostImage !== "" && data.smPostImage.split(",").length > 0) &&
                                <div className="sm-pv-media-twitter">
                                    <div className="sm-pv-images-twitter mr-1" style={{ backgroundImage: `url(${siteURL}/easdrive/${user.memberId}/images/socialmedia/${data.smPostImage.split(",")[0]})` }}></div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        {data.smPostImage.split(",").length > 1 &&
                                            data.smPostImage.split(",").map((image, index) => {
                                                if (index > 0 && index < 4)
                                                    return <div className={`${data.smPostImage.split(",").length === 2 ? "sm-pv-images-twitter" : data.smPostImage.split(",").length === 3 ? "sm-pv-images-twitter-multiple-2" : "sm-pv-images-twitter-multiple-3"}`} style={{ backgroundImage: `url(${siteURL}/easdrive/${user.memberId}/images/socialmedia/${image})` }} key={index}></div>
                                                else
                                                    return null
                                            })}
                                    </div>
                                </div>
                            }
                            {
                                (data.smPostVideoTwitter !== "") &&
                                <div className="sm-pv-video-media-twitter">
                                    <div className="sm-pv-video-twitter" style={{ backgroundImage: `url(${videoThumbnailTwt})` }}></div>
                                </div>
                            }
                            <div className="sm-pv-twitter-controls">
                                <span className="sm-pv-share-controls-iconReply"></span>
                                <span className="sm-pv-share-controls-iconRetweet"></span>
                                <span className="sm-pv-share-controls-iconLike"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            {optionsStatus.linkedin && <div className="sm-pv-post sm-pv-post-linkedin">
                <h6 className="sm-pv-post-title sm-pv-post-title">
                    <i className="fab fa-linkedin"></i> LinkedIn
                </h6>
                <div className="sm-post-list-wrap w-100">
                    <div className="sm-post-wrap">
                        <div className={`sm-post-wrap-linkedin ${viewSelected === 1 ? "w-100" : "w-75"}`}>
                            <div className="sm-pv-linkedin-header">
                                <div className="sm-post-avatar-wrap-linkedin">
                                    <div className="sm-post-accountImage-linkedin">
                                        <div data-char="" className="sm-post-accountImage-wrap">
                                            <img src={dataLinkedIn.img} alt="linkedin" />
                                        </div>
                                    </div>
                                </div>
                                <span className="sm-post-name-linkedin">{dataLinkedIn.name}</span>
                                <div className="sm-post-dt-linkedin">just now</div>
                            </div>
                            <div className="white-space-pre-line" dangerouslySetInnerHTML={{ __html: captions.linkedin }}></div>
                            <div className="sm-pv-media-linkedin">
                                <div className="sm-pv-images-wrap-linkedin">
                                    {
                                        (data.smPostImage !== "" && data.smPostImage.split(",").length > 0) &&
                                        <div className="sm-pv-images-linkedin" style={{ backgroundImage: `url(${siteURL}/easdrive/${user.memberId}/images/socialmedia/${data.smPostImage.split(",")[0]})` }}>
                                        </div>
                                    }
                                </div>
                                {
                                    (data.smPostVideoLinkedin !== "") &&
                                    <div className="sm-pv-video-wrap-linkedin">
                                        <img className="sm-pv-video-linkedin" src={videoThumbnaiLin} alt="linkedin-preview" />
                                    </div>
                                }
                            </div>
                            <div className="sm-pv-linkedin-controls">
                                <div className="linkedin-control-container">
                                    <div className="control-container-inner">
                                        <div className="icon-container">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14">
                                                <path d="M12.6,6 L10.7,2.8 C10.4,2.3 10.2,1.7 10,1.1 L9.8,0 C9.8,0 9.8,0 9.8,0 L8,0 C6.9,0 6,0.9 6,2 L6,2.4 C6,3 6.1,3.7 6.3,4.3 L6.5,5 C6.5,5 6.5,5 6.5,5 L3.5,5 C2.7,5 2,5.7 2,6.5 C2,6.9 2.1,7.2 2.4,7.5 C2.4,7.5 2.4,7.5 2.4,7.5 C2.1,7.8 2,8.1 2,8.5 C2,9 2.3,9.5 2.7,9.8 C2.7,9.8 2.7,9.8 2.7,9.8 C2.6,10 2.5,10.3 2.5,10.5 C2.5,11.3 3.1,11.9 3.8,12 C3.8,12 3.8,12 3.8,12 C3.7,12.3 3.7,12.6 3.8,13 C4,13.6 4.7,14 5.3,14 L8,14 C8.9,14 9.5,13.9 10.1,13.7 L12.2,13 C12.2,13 12.2,13 12.2,13 L15,13 C15,13 15,13 15,13 L15,6 C15,6 15,6 15,6 L12.6,6 C12.6,6 12.6,6 12.6,6 Z M4.4,9.1 L4,8.6 C3.9,8.4 3.8,8.2 3.9,7.9 L4,7 C4,7 4,7 4,7 L9.1,7 C9.1,7 9.1,7 9.1,7 L8,3.7 C7.9,3.3 7.9,2.8 7.9,2.4 L7.9,2.1 C7.9,1.9 8.1,1.7 8.3,1.7 C8.3,1.7 8.4,1.7 8.4,1.7 C8.5,2.4 8.8,3.2 9.1,3.7 L11.7,8 C11.7,8 11.7,8 11.7,8 L13,8 C13,8 13,8 13,8 L13,11 C13,11 13,11 13,11 L12.4,11 C12.4,11 12.4,11 12.4,11 L9.9,11.8 C9.5,11.9 9.1,12 8.7,12 L5.9,12 C5.7,12 5.5,11.8 5.4,11.6 L5.3,11.1 L4.7,10.6 C4.5,10.4 4.3,10.1 4.4,9.8 L4.4,9.1 Z">
                                                </path>
                                            </svg>
                                        </div>
                                        <div className="text-style" style={{ marginLeft: "12px" }}>Like</div>
                                    </div>
                                    <div className="control-container-inner">
                                        <div className="icon-container">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14">
                                                <path d="M14,1 L2,1 C1.44771525,1 1,1.44771525 1,2 L1,9 C1,9.55228475 1.44771525,10 2,10 L11,10 L15,13 L15,2 C15,1.44771525 14.5522847,1 14,1 Z M3,8 L3,3 L13,3 L13,9.11 L11.52,8 L3,8 Z M5,5 L11,5 L11,6 L5,6 L5,5 Z">
                                                </path>
                                            </svg>
                                        </div>
                                        <div className="text-style" style={{ marginLeft: "11px" }}>Comment</div>
                                    </div>
                                    <div className="control-container-inner">
                                        <div className="icon-container">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14">
                                                <path d="M15.7,6.3 L9,0 L9,4 L7,4 C3.1,4 0,7.1 0,11 L0,14 L1.4,14 C1.4,11.8 3.3,10 5.5,10 C5.5,10 5.6,10 5.6,10 L9,10 L9,14 L9,14 L15.7,7.7 C16.1,7.4 16.1,6.7 15.7,6.3 C15.7,6.3 15.7,6.3 15.7,6.3 Z M11,9.6 L11,8 L5.6,8 C4.4,8 3.2,8.4 2.2,9.1 C3.1,7.2 4.9,6 7,6 L11,6 L11,4.4 L13.7,7 L11,9.6 Z">
                                                </path>
                                            </svg>
                                        </div>
                                        <div className="text-style" style={{ marginLeft: "9px" }}>Share</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default PostPreview