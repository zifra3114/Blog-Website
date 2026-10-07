import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchUserByUsername,
  toggleFollow,
  clearProfile,
} from "./userSlice";

import { fetchPosts } from "../blog/blogSlice";
import BlogCard from "../../components/ui/BlogCard";

const TABS = ["posts", "about"];

const ProfilePage = () => {
  const { username } = useParams();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("posts");

  const { profile, profileLoading, profileError } = useSelector(
    (state) => state.user
  );

  const { user: currentUser, loading: authLoading } = useSelector(
    (state) => state.auth
  );

  const { posts: blogPosts, listLoading: postsLoading } = useSelector(
    (state) => state.blog
  );

  // ==========================================
  // FETCH PROFILE
  // ==========================================

  useEffect(() => {
    if (username) {
      dispatch(fetchUserByUsername(username));
    }

    return () => {
      dispatch(clearProfile());
    };
  }, [dispatch, username]);

  // ==========================================
  // FETCH POSTS
  // ==========================================

  useEffect(() => {
    if (profile?._id && activeTab === "posts") {
      dispatch(
        fetchPosts({
          author: profile._id,
          status: "published",
        })
      );
    }
  }, [dispatch, profile?._id, activeTab]);

  // ==========================================
  // PAGE TITLE
  // ==========================================

  useEffect(() => {
    document.title = profile?.name
      ? `${profile.name} • DevBlog`
      : "Profile • DevBlog";
  }, [profile?.name]);

  // ==========================================
  // LOADING
  // ==========================================

  if (profileLoading || authLoading) {
    return (
      <div className="ig-profile-loading">
        <div className="ig-spinner"></div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (profileError) {
    return (
      <div className="ig-profile-error">
        <div className="ig-error-card">

          <div className="ig-error-icon">
            404
          </div>

          <h2>
            User not found
          </h2>

          <p>
            We couldn't find <strong>@{username}</strong>
          </p>

          <Link
            to="/"
            className="ig-primary-btn"
          >
            Back to Home
          </Link>

        </div>
      </div>
    );
  }

  if (!profile) return null;

  // ==========================================
  // PROFILE DATA
  // ==========================================

  const isOwnProfile =
    currentUser?._id &&
    profile?._id &&
    currentUser._id === profile._id;

  const followers = profile.followerCount || 0;

  const following = profile.followingCount || 0;

  const postCount =
    profile.postsCount ??
    profile.postCount ??
    blogPosts?.length ??
    0;

  // ==========================================
  // AVATAR
  // ==========================================

  const avatarImage =
    profile.avatar?.url ||
    profile.profileImage?.url ||
    profile.profilePicture?.url ||
    profile.image?.url ||
    "";

  // ==========================================
  // COVER / BANNER
  // ==========================================

  const bannerImage =
    profile.coverImage?.url ||
    profile.banner?.url ||
    profile.cover?.url ||
    profile.coverPhoto?.url ||
    profile.backgroundImage?.url ||
    "";

  // ==========================================
  // SOCIAL LINKS
  // ==========================================

  const socialLinks = [
    {
      name: "GitHub",
      url: profile.socialLinks?.github,
      icon: "⌘",
    },
    {
      name: "LinkedIn",
      url: profile.socialLinks?.linkedin,
      icon: "in",
    },
    {
      name: "Twitter",
      url: profile.socialLinks?.twitter,
      icon: "𝕏",
    },
    {
      name: "Instagram",
      url: profile.socialLinks?.instagram,
      icon: "◎",
    },
    {
      name: "Facebook",
      url: profile.socialLinks?.facebook,
      icon: "f",
    },
    {
      name: "YouTube",
      url: profile.socialLinks?.youtube,
      icon: "▶",
    },
  ].filter((item) => item.url);

  const skills = Array.isArray(profile.skills)
    ? profile.skills
    : [];

  const experiences = Array.isArray(profile.experience)
    ? profile.experience
    : [];

  const education = Array.isArray(profile.education)
    ? profile.education
    : [];

  const joinedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(
        "en-US",
        {
          month: "long",
          year: "numeric",
        }
      )
    : "Recently";

  // ==========================================
  // FOLLOW
  // ==========================================

  const handleFollow = () => {
    if (profile?._id) {
      dispatch(toggleFollow(profile._id));
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="instagram-profile-page">

      <div className="instagram-profile-container">

        {/* ==========================================
            PROFILE HEADER
        ========================================== */}

        <section className="instagram-profile-card">

          {/* COVER */}

          <div className="instagram-cover">

            {bannerImage ? (
              <img
                src={bannerImage}
                alt={`${profile.name} cover`}
                className="instagram-cover-image"
              />
            ) : (
              <div className="instagram-default-cover">
                <div className="cover-glow glow-one"></div>
                <div className="cover-glow glow-two"></div>
                <div className="cover-glow glow-three"></div>
              </div>
            )}

            <div className="instagram-cover-overlay"></div>

            <div className="cover-label">
              DEV PROFILE
            </div>

          </div>

          {/* PROFILE BODY */}

          <div className="instagram-profile-body">

            {/* AVATAR */}

            <div className="instagram-avatar-wrapper">

              {avatarImage ? (
                <img
                  src={avatarImage}
                  alt={profile.name}
                  className="instagram-avatar"
                />
              ) : (
                <div className="instagram-avatar-fallback">
                  {(profile.name || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <span className="instagram-online-dot"></span>

            </div>

            {/* TOP */}

            <div className="instagram-profile-top">

              <div className="instagram-profile-heading">

                <div className="instagram-name-row">

                  <h1>
                    {profile.name}
                  </h1>

                  {profile.isEmailVerified && (
                    <span className="instagram-verified">
                      ✓
                    </span>
                  )}

                </div>

                <p className="instagram-username">
                  @{profile.username}
                </p>

                {profile.headline && (
                  <p className="instagram-headline">
                    {profile.headline}
                  </p>
                )}

              </div>

              {/* ACTIONS */}

              <div className="instagram-actions">

                {isOwnProfile ? (
                  <Link
                    to="/settings"
                    className="instagram-edit-btn"
                  >
                    Edit Profile
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={handleFollow}
                    className={`instagram-follow-btn ${
                      profile.isFollowing
                        ? "is-following"
                        : ""
                    }`}
                  >
                    {profile.isFollowing
                      ? "Following"
                      : "Follow"}
                  </button>
                )}

                {!isOwnProfile && (
                  <button
                    type="button"
                    className="instagram-more-btn"
                  >
                    •••
                  </button>
                )}

              </div>

            </div>

            {/* BIO */}

            {profile.bio && (
              <div className="instagram-bio">
                {profile.bio}
              </div>
            )}

            {/* STATS */}

            <div className="instagram-stats">

              <div className="instagram-stat">
                <strong>
                  {postCount}
                </strong>

                <span>
                  Posts
                </span>
              </div>

              <div className="instagram-stat">
                <strong>
                  {followers}
                </strong>

                <span>
                  Followers
                </span>
              </div>

              <div className="instagram-stat">
                <strong>
                  {following}
                </strong>

                <span>
                  Following
                </span>
              </div>

            </div>

            {/* DETAILS */}

            <div className="instagram-details">

              {profile.location && (
                <div className="instagram-detail">
                  <span>📍</span>
                  {profile.location}
                </div>
              )}

              {profile.website && (
                <a
                  href={
                    profile.website.startsWith("http")
                      ? profile.website
                      : `https://${profile.website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="instagram-detail instagram-link"
                >
                  <span>🔗</span>

                  {profile.website.replace(
                    /^https?:\/\//,
                    ""
                  )}
                </a>
              )}

              <div className="instagram-detail">
                <span>📅</span>
                Joined {joinedDate}
              </div>

            </div>

            {/* SOCIAL LINKS */}

            {socialLinks.length > 0 && (
              <div className="instagram-socials">

                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={
                      social.url.startsWith("http")
                        ? social.url
                        : `https://${social.url}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="instagram-social"
                  >
                    <span className="social-icon">
                      {social.icon}
                    </span>

                    {social.name}
                  </a>
                ))}

              </div>
            )}

            {/* SKILLS */}

            {skills.length > 0 && (
              <div className="instagram-skills">

                {skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="instagram-skill"
                  >
                    {skill}
                  </span>
                ))}

              </div>
            )}

          </div>
        </section>

        {/* ==========================================
            CONTENT
        ========================================== */}

        <section className="instagram-content">

          {/* TABS */}

          <div className="instagram-tabs">

            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`instagram-tab ${
                  activeTab === tab
                    ? "active"
                    : ""
                }`}
              >

                <span className="tab-icon">
                  {tab === "posts"
                    ? "▦"
                    : "☷"}
                </span>

                {tab === "posts"
                  ? "POSTS"
                  : "ABOUT"}

              </button>
            ))}

          </div>

          {/* ==========================================
              POSTS
          ========================================== */}

          {activeTab === "posts" && (
            <div className="instagram-post-section">

              {postsLoading ? (
                <div className="instagram-post-loader">
                  <div className="ig-spinner"></div>
                </div>
              ) : blogPosts?.length > 0 ? (

                <div className="instagram-posts">

                  {blogPosts.map((post) => (
                    <div
                      key={post._id}
                      className="instagram-post-card"
                    >
                      <BlogCard post={post} />
                    </div>
                  ))}

                </div>

              ) : (

                <div className="instagram-empty">

                  <div className="instagram-empty-icon">
                    ▦
                  </div>

                  <h3>
                    No posts yet
                  </h3>

                  <p>
                    {isOwnProfile
                      ? "Your published posts will appear here."
                      : `${profile.name} hasn't published anything yet.`}
                  </p>

                </div>

              )}

            </div>
          )}

          {/* ==========================================
              ABOUT
          ========================================== */}

          {activeTab === "about" && (
            <div className="instagram-about">

              {/* BIO */}

              {profile.bio && (
                <div className="instagram-about-card instagram-about-full">

                  <div className="about-heading">
                    <span>✦</span>
                    About
                  </div>

                  <p>
                    {profile.bio}
                  </p>

                </div>
              )}

              {/* DETAILS */}

              <div className="instagram-about-card">

                <div className="about-heading">
                  <span>◉</span>
                  Profile Details
                </div>

                <div className="about-details">

                  <div>
                    <span>
                      Username
                    </span>

                    <strong>
                      @{profile.username}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Joined
                    </span>

                    <strong>
                      {joinedDate}
                    </strong>
                  </div>

                  {profile.location && (
                    <div>
                      <span>
                        Location
                      </span>

                      <strong>
                        {profile.location}
                      </strong>
                    </div>
                  )}

                  {profile.website && (
                    <div>
                      <span>
                        Website
                      </span>

                      <strong>
                        {profile.website.replace(
                          /^https?:\/\//,
                          ""
                        )}
                      </strong>
                    </div>
                  )}

                </div>

              </div>

              {/* EXPERIENCE */}

              {experiences.length > 0 && (
                <div className="instagram-about-card">

                  <div className="about-heading">
                    <span>💼</span>
                    Experience
                  </div>

                  <div className="instagram-timeline">

                    {experiences.map(
                      (experience, index) => (
                        <div
                          className="timeline-item"
                          key={
                            experience._id ||
                            index
                          }
                        >

                          <div className="timeline-dot"></div>

                          <div>

                            <h4>
                              {experience.position ||
                                experience.title}
                            </h4>

                            <p>
                              {experience.company}
                            </p>

                            {(experience.startDate ||
                              experience.endDate) && (
                              <small>
                                {experience.startDate ||
                                  ""}

                                {experience.startDate &&
                                experience.endDate
                                  ? " — "
                                  : ""}

                                {experience.endDate ||
                                  "Present"}
                              </small>
                            )}

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

              {/* EDUCATION */}

              {education.length > 0 && (
                <div className="instagram-about-card">

                  <div className="about-heading">
                    <span>🎓</span>
                    Education
                  </div>

                  <div className="instagram-timeline">

                    {education.map(
                      (item, index) => (
                        <div
                          className="timeline-item"
                          key={
                            item._id ||
                            index
                          }
                        >

                          <div className="timeline-dot"></div>

                          <div>

                            <h4>
                              {item.degree ||
                                item.title}
                            </h4>

                            <p>
                              {item.institution ||
                                item.school}
                            </p>

                            {item.year && (
                              <small>
                                {item.year}
                              </small>
                            )}

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

            </div>
          )}

        </section>
      </div>

      {/* ==========================================
          CSS
      ========================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        /* ==========================================
           PAGE
        ========================================== */

        .instagram-profile-page {
          min-height: 100vh;
          padding: 30px 20px 70px;

          background:
            radial-gradient(
              circle at 15% 0%,
              rgba(131, 58, 180, .15),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 10%,
              rgba(0, 149, 246, .08),
              transparent 25%
            ),
            #09090b;

          color: #f5f5f5;
        }

        .instagram-profile-container {
          width: min(1050px, 100%);
          margin: auto;
        }

        /* ==========================================
           PROFILE CARD
        ========================================== */

        .instagram-profile-card {
          overflow: hidden;

          border: 1px solid #27272a;

          border-radius: 18px;

          background: #111113;

          box-shadow:
            0 20px 70px rgba(0,0,0,.35);
        }

        /* ==========================================
           COVER
        ========================================== */

        .instagram-cover {
          position: relative;

          height: 300px;

          overflow: hidden;

          background: #18181b;
        }

        .instagram-cover-image {
          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;

          filter: brightness(.82);
        }

        .instagram-default-cover {
          position: absolute;
          inset: 0;

          overflow: hidden;

          background:
            linear-gradient(
              135deg,
              #833ab4,
              #fd1d1d,
              #fcb045
            );
        }

        .cover-glow {
          position: absolute;

          width: 500px;
          height: 500px;

          border-radius: 50%;

          filter: blur(70px);

          opacity: .35;
        }

        .glow-one {
          background: #833ab4;

          left: -200px;
          top: -250px;
        }

        .glow-two {
          background: #fd1d1d;

          right: -150px;
          top: -150px;
        }

        .glow-three {
          background: #fcb045;

          left: 40%;
          bottom: -400px;
        }

        .instagram-cover-overlay {
          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              to bottom,
              rgba(0,0,0,.02),
              rgba(0,0,0,.5)
            );
        }

        .cover-label {
          position: absolute;

          top: 18px;
          right: 18px;

          padding: 8px 12px;

          border: 1px solid rgba(255,255,255,.18);

          border-radius: 8px;

          background: rgba(0,0,0,.38);

          color: #fff;

          font-size: 10px;

          font-weight: 800;

          letter-spacing: 1px;

          backdrop-filter: blur(12px);
        }

        /* ==========================================
           PROFILE BODY
        ========================================== */

        .instagram-profile-body {
          padding: 0 38px 30px;
        }

        /* ==========================================
           AVATAR
        ========================================== */

        .instagram-avatar-wrapper {
          position: relative;

          width: 150px;
          height: 150px;

          margin-top: -75px;
          margin-bottom: 20px;

          padding: 5px;

          border-radius: 50%;

          background: #111113;

          box-shadow:
            0 12px 40px rgba(0,0,0,.45);
        }

        .instagram-avatar {
          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;

          border-radius: 50%;

          border: 3px solid #27272a;
        }

        .instagram-avatar-fallback {
          width: 100%;
          height: 100%;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              #833ab4,
              #fd1d1d,
              #fcb045
            );

          color: white;

          font-size: 48px;

          font-weight: 800;
        }

        .instagram-online-dot {
          position: absolute;

          right: 10px;
          bottom: 12px;

          width: 21px;
          height: 21px;

          border-radius: 50%;

          background: #22c55e;

          border: 4px solid #111113;

          box-shadow:
            0 0 15px rgba(34,197,94,.5);
        }

        /* ==========================================
           PROFILE TOP
        ========================================== */

        .instagram-profile-top {
          display: flex;

          align-items: flex-start;

          justify-content: space-between;

          gap: 30px;
        }

        .instagram-profile-heading {
          min-width: 0;
        }

        .instagram-name-row {
          display: flex;

          align-items: center;

          gap: 9px;
        }

        .instagram-name-row h1 {
          margin: 0;

          color: #fff;

          font-size: 28px;

          font-weight: 750;

          letter-spacing: -.7px;
        }

        .instagram-verified {
          width: 20px;
          height: 20px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #0095f6;

          color: white;

          font-size: 11px;

          font-weight: 900;
        }

        .instagram-username {
          margin: 5px 0 0;

          color: #a1a1aa;

          font-size: 14px;
        }

        .instagram-headline {
          margin: 9px 0 0;

          color: #e4e4e7;

          font-size: 14px;

          font-weight: 600;
        }

        /* ==========================================
           ACTIONS
        ========================================== */

        .instagram-actions {
          display: flex;

          gap: 9px;

          flex-shrink: 0;
        }

        .instagram-edit-btn,
        .instagram-follow-btn,
        .instagram-more-btn {
          min-height: 39px;

          padding: 0 17px;

          border-radius: 8px;

          border: 1px solid #3f3f46;

          background: #27272a;

          color: #fff;

          font-size: 13px;

          font-weight: 700;

          text-decoration: none;

          cursor: pointer;

          transition: .2s ease;
        }

        .instagram-edit-btn:hover,
        .instagram-more-btn:hover {
          background: #3f3f46;
        }

        .instagram-follow-btn {
          border-color: #0095f6;

          background: #0095f6;

          color: #fff;
        }

        .instagram-follow-btn:hover {
          background: #0084d6;
        }

        .instagram-follow-btn.is-following {
          border-color: #3f3f46;

          background: #27272a;

          color: #fff;
        }

        .instagram-more-btn {
          width: 42px;

          padding: 0;
        }

        /* ==========================================
           BIO
        ========================================== */

        .instagram-bio {
          max-width: 720px;

          margin-top: 17px;

          color: #d4d4d8;

          font-size: 14px;

          line-height: 1.6;

          white-space: pre-line;
        }

        /* ==========================================
           STATS
        ========================================== */

        .instagram-stats {
          display: flex;

          gap: 42px;

          margin-top: 20px;

          padding: 15px 0;

          border-top: 1px solid #27272a;

          border-bottom: 1px solid #27272a;
        }

        .instagram-stat {
          display: flex;

          align-items: center;

          gap: 6px;

          font-size: 14px;
        }

        .instagram-stat strong {
          color: #fff;

          font-size: 15px;
        }

        .instagram-stat span {
          color: #a1a1aa;
        }

        /* ==========================================
           DETAILS
        ========================================== */

        .instagram-details {
          display: flex;

          flex-wrap: wrap;

          gap: 18px;

          margin-top: 15px;
        }

        .instagram-detail {
          display: flex;

          align-items: center;

          gap: 6px;

          color: #a1a1aa;

          font-size: 13px;
        }

        .instagram-link {
          color: #60a5fa;

          text-decoration: none;

          font-weight: 600;
        }

        /* ==========================================
           SOCIALS
        ========================================== */

        .instagram-socials {
          display: flex;

          flex-wrap: wrap;

          gap: 7px;

          margin-top: 15px;
        }

        .instagram-social {
          display: inline-flex;

          align-items: center;

          gap: 6px;

          padding: 7px 10px;

          border: 1px solid #27272a;

          border-radius: 8px;

          background: #18181b;

          color: #d4d4d8;

          text-decoration: none;

          font-size: 12px;

          font-weight: 600;

          transition: .2s ease;
        }

        .instagram-social:hover {
          background: #27272a;

          border-color: #52525b;
        }

        .social-icon {
          color: #fff;

          font-weight: 800;
        }

        /* ==========================================
           SKILLS
        ========================================== */

        .instagram-skills {
          display: flex;

          flex-wrap: wrap;

          gap: 7px;

          margin-top: 15px;
        }

        .instagram-skill {
          padding: 6px 10px;

          border: 1px solid #27272a;

          border-radius: 999px;

          background: #18181b;

          color: #a1a1aa;

          font-size: 11px;

          font-weight: 600;
        }

        /* ==========================================
           CONTENT
        ========================================== */

        .instagram-content {
          margin-top: 18px;

          overflow: hidden;

          border: 1px solid #27272a;

          border-radius: 18px;

          background: #111113;

          box-shadow:
            0 15px 50px rgba(0,0,0,.25);
        }

        /* ==========================================
           TABS
        ========================================== */

        .instagram-tabs {
          display: flex;

          justify-content: center;

          gap: 65px;

          height: 55px;

          border-bottom: 1px solid #27272a;
        }

        .instagram-tab {
          position: relative;

          min-width: 95px;

          border: none;

          background: transparent;

          color: #71717a;

          font-size: 11px;

          font-weight: 800;

          letter-spacing: .7px;

          cursor: pointer;
        }

        .instagram-tab.active {
          color: #fff;
        }

        .instagram-tab.active::after {
          content: "";

          position: absolute;

          left: 0;
          right: 0;

          bottom: -1px;

          height: 2px;

          background:
            linear-gradient(
              90deg,
              #833ab4,
              #fd1d1d,
              #fcb045
            );
        }

        .tab-icon {
          margin-right: 6px;

          font-size: 15px;
        }

        /* ==========================================
           POSTS - COMPACT
        ========================================== */

        .instagram-post-section {
          padding: 16px 20px;
        }

        .instagram-posts {
          display: grid;

          gap: 12px;
        }

        .instagram-post-card {
          width: min(760px, 100%);

          margin: 0 auto;

          padding: 0 0 12px;

          border-bottom: 1px solid #27272a;
        }

        .instagram-post-card:last-child {
          border-bottom: none;

          padding-bottom: 0;
        }

        /*
          BlogCard ko unnecessarily huge
          hone se prevent karta hai.
        */

        .instagram-post-card > * {
          max-height: 830px;

          overflow: hidden;
        }

        .instagram-post-loader {
          min-height: 220px;

          display: flex;

          align-items: center;
          justify-content: center;
        }

        /* ==========================================
           EMPTY POSTS
        ========================================== */

        .instagram-empty {
          min-height: 270px;

          display: flex;

          flex-direction: column;

          align-items: center;
          justify-content: center;

          text-align: center;

          color: #71717a;
        }

        .instagram-empty-icon {
          width: 60px;
          height: 60px;

          display: flex;

          align-items: center;
          justify-content: center;

          margin-bottom: 14px;

          border: 2px solid #3f3f46;

          border-radius: 50%;

          color: #d4d4d8;

          font-size: 27px;
        }

        .instagram-empty h3 {
          margin: 0 0 6px;

          color: #f4f4f5;

          font-size: 17px;
        }

        .instagram-empty p {
          margin: 0;

          color: #71717a;

          font-size: 13px;
        }

        /* ==========================================
           ABOUT
        ========================================== */

        .instagram-about {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 15px;

          padding: 20px;
        }

        .instagram-about-card {
          padding: 19px;

          border: 1px solid #27272a;

          border-radius: 12px;

          background: #18181b;
        }

        .instagram-about-full {
          grid-column: 1 / -1;
        }

        .about-heading {
          display: flex;

          align-items: center;

          gap: 8px;

          margin-bottom: 14px;

          color: #f4f4f5;

          font-size: 14px;

          font-weight: 750;
        }

        .about-heading span {
          color: #a855f7;
        }

        .instagram-about-card > p {
          margin: 0;

          color: #a1a1aa;

          line-height: 1.7;

          font-size: 13px;
        }

        .about-details {
          display: grid;

          gap: 11px;
        }

        .about-details > div {
          display: flex;

          justify-content: space-between;

          gap: 20px;

          padding-bottom: 10px;

          border-bottom: 1px solid #27272a;

          font-size: 12px;
        }

        .about-details > div:last-child {
          padding-bottom: 0;

          border-bottom: none;
        }

        .about-details span {
          color: #71717a;
        }

        .about-details strong {
          color: #e4e4e7;

          text-align: right;
        }

        /* ==========================================
           TIMELINE
        ========================================== */

        .instagram-timeline {
          display: grid;

          gap: 18px;
        }

        .timeline-item {
          display: flex;

          gap: 13px;
        }

        .timeline-dot {
          width: 9px;
          height: 9px;

          margin-top: 5px;

          flex-shrink: 0;

          border-radius: 50%;

          background: #a855f7;

          box-shadow:
            0 0 0 5px rgba(168,85,247,.10);
        }

        .timeline-item h4 {
          margin: 0;

          color: #f4f4f5;

          font-size: 13px;
        }

        .timeline-item p {
          margin: 4px 0;

          color: #a1a1aa;

          font-size: 12px;
        }

        .timeline-item small {
          color: #71717a;

          font-size: 10px;
        }

        /* ==========================================
           LOADING
        ========================================== */

        .ig-profile-loading {
          min-height: 70vh;

          display: flex;

          align-items: center;
          justify-content: center;

          background: #09090b;
        }

        .ig-spinner {
          width: 33px;
          height: 33px;

          border: 3px solid #27272a;

          border-top-color: #a855f7;

          border-radius: 50%;

          animation: igSpin .8s linear infinite;
        }

        @keyframes igSpin {

          to {
            transform: rotate(360deg);
          }

        }

        /* ==========================================
           ERROR
        ========================================== */

        .ig-profile-error {
          min-height: 70vh;

          display: flex;

          align-items: center;
          justify-content: center;

          padding: 20px;

          background: #09090b;
        }

        .ig-error-card {
          width: min(400px, 100%);

          padding: 35px;

          text-align: center;

          border: 1px solid #27272a;

          border-radius: 14px;

          background: #111113;
        }

        .ig-error-icon {
          width: 65px;
          height: 65px;

          margin: 0 auto 15px;

          display: flex;

          align-items: center;
          justify-content: center;

          border: 2px solid #52525b;

          border-radius: 50%;

          color: #fff;

          font-size: 14px;

          font-weight: 700;
        }

        .ig-error-card h2 {
          margin: 0;

          color: #fff;

          font-size: 20px;
        }

        .ig-error-card p {
          color: #a1a1aa;

          font-size: 13px;
        }

        .ig-primary-btn {
          display: inline-flex;

          padding: 10px 17px;

          border-radius: 8px;

          background: #0095f6;

          color: white;

          text-decoration: none;

          font-size: 13px;

          font-weight: 600;
        }

        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 700px) {

          .instagram-profile-page {
            padding: 0 0 40px;
          }

          .instagram-profile-card,
          .instagram-content {
            border-radius: 0;

            border-left: none;
            border-right: none;
          }

          .instagram-cover {
            height: 210px;
          }

          .instagram-profile-body {
            padding: 0 16px 24px;
          }

          .instagram-avatar-wrapper {
            width: 110px;
            height: 110px;

            margin-top: -55px;
          }

          .instagram-online-dot {
            width: 18px;
            height: 18px;

            right: 8px;
            bottom: 9px;
          }

          .instagram-profile-top {
            flex-direction: column;

            align-items: flex-start;

            gap: 15px;
          }

          .instagram-name-row h1 {
            font-size: 23px;
          }

          .instagram-actions {
            width: 100%;
          }

          .instagram-edit-btn,
          .instagram-follow-btn {
            flex: 1;

            display: flex;

            align-items: center;
            justify-content: center;
          }

          .instagram-more-btn {
            flex: 0 0 42px;
          }

          .instagram-stats {
            justify-content: space-between;

            gap: 10px;
          }

          .instagram-stat {
            flex-direction: column;

            gap: 3px;
          }

          .instagram-details {
            flex-direction: column;

            gap: 10px;
          }

          .instagram-tabs {
            gap: 20px;
          }

          .instagram-post-section {
            padding: 12px;
          }

          .instagram-posts {
            gap: 10px;
          }

          .instagram-post-card {
            padding-bottom: 10px;
          }

          .instagram-about {
            grid-template-columns: 1fr;

            padding: 14px;
          }

          .instagram-about-full {
            grid-column: auto;
          }

        }

      `}</style>

    </div>
  );
};

export default ProfilePage;