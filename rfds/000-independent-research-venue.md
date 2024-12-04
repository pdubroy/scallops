# Independent Research Venue

## Mission

- Create a curated platform for independent research focused on novel software interfaces
- Maintain high signal-to-noise ratio through careful content curation
- Build a trusted network of independent researchers and practitioners

## Content Focus

- Human-Computer Interaction research
- Interface design studies and experiments
- User experience research findings
- Novel interaction paradigms
- Empirical studies of digital tools
- Prototypes and proof-of-concepts

## Community Structure

### Membership Models

- Direct invitation from existing members
- Submission of original HCI research for peer review
- Contribution through curation (identifying and submitting notable external HCI research)

### Roles

- Researcher: Can submit original work and participate in discussions
- Reviewer: Evaluates submissions for technical merit and relevance
- Moderator: Maintains community standards and discussion quality
- Admin: Platform governance and technical maintenance

### Review Process

- Initial submission triage
- Technical review by domain experts
- Quality and relevance assessment
- Publication decision

## Technical Implementation

- Minimal viable feature set to start
- Focus on content quality over social features
- Possible integration with atproto for decentralized identity
- Simple, maintainable codebase

## Open Questions

- Integration with existing academic publishing workflows?
- Balance between peer review and open publishing?
- Metrics for measuring community health?
- Tools for collaborative research?

## Definition of the field

Ink and Switch

> We envision a new computer that amplifies human intelligence. A system that helps you think more clearly, collaborate more effectively, and is available anywhere and anytime.

Andy Matuschak

> I'm an applied researcher, focused on creating user interfaces that expand what people can think and do

Alexander Obenauer

> Exploring new and renewed ideas for how personal computing and the interfaces with which we think can better serve people’s lives

Linus Lee

> My research investigates the future of knowledge representation and creative work aided by machine understanding of language. I prototype software interfaces that help us become clearer thinkers and more prolific dreamers.

## Possible collaborations

- https://haystack.csail.mit.edu/

// ... rest of the schema details can remain the same ...

Goals

- Become a central point for the independent research community to share their work
- The focus is on research and technical exploration in the space
- Discourage distracting conversation or side commentary. _Should comments even be supported?_
- Invitations to contribute based on chain-of-trust. Wholesale borrows lobster's invite model and user tree.
- A focus on keeping the technical implementation as simple as feasibly possible

Basic Design

There are a few mechanisms by which users can join the network:

- Being invited by a current member of the network
- Submitting their work for review and having it approved by a reviewer
- Submitting 3 pieces of work done by those who aren’t current members and having each approved by a reviewer

We will maintain a member tree similar to lobsters.
Roles

- Researcher
- Reviewer
- Moderator (if comments are allowed)

Open Questions
Can we support atproto? Particularly the domain name based feature.

Roles

- Publisher
- Reviewer
- Moderator
- Admin

| ID  | referer | handle       | level | kind  |
| --- | ------- | ------------ | ----- | ----- |
| 0   | null    | justbe       | 0     | user  |
| 1   | null    | inkandswitch | 0     | group |

## User flows

### Independent Researcher

- Isn't connected with the community
- Submits a work
  - _"Is this your work or are you publishing on behalf of someone else?"_ (Do we allow second-hand submissions?)
  - Create a profile (?)
- Work goes into moderation queue
  - If first-time self submission, identity must be verified
  - If work is approved or denied based on a set list of options
    - Options
      - **Approved** -- Work is topical; well structured
      - **Flagged for further review** -- Work may edge off topic or be presented in a way of questionable suitability. Flagged for a secondary moderator review.
      - **Denied** -- Work is not topical
