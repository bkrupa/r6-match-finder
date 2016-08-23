using R6MatchFinder.Common.Utility;
using System.Collections.Generic;

namespace R6MatchFinder.Models
{
    internal class GoogleAccountInfo
    {
        public class GoogleEmail
        {
            public string value { get; set; }
            public string type { get; set; }
        }

        public class GoogleName
        {
            public string familyName { get; set; }
            public string givenName { get; set; }
        }

        public class GoogleImage
        {
            public string url { get; set; }
            public bool isDefault { get; set; }
        }

        public class GoogleOrganization
        {
            public string name { get; set; }
            public string title { get; set; }
            public string type { get; set; }
            public string startDate { get; set; }
            public string endDate { get; set; }
            public bool primary { get; set; }
        }

        public class GoogleAgeRange
        {
            public int? min { get; set; }
        }

        public string kind { get; set; }
        public string etag { get; set; }
        public string occupation { get; set; }
        public Gender gender { get; set; }
        public List<GoogleEmail> emails { get; set; }
        public string objectType { get; set; }
        public string id { get; set; }
        public string displayName { get; set; }
        public GoogleName name { get; set; }
        public string url { get; set; }
        public GoogleImage image { get; set; }
        public List<GoogleOrganization> organizations { get; set; }
        public bool isPlusUser { get; set; }
        public string language { get; set; }
        public GoogleAgeRange ageRange { get; set; }
        public int circledByCount { get; set; }
        public bool verified { get; set; }
    }

    internal class FacebookAccountInfo
    {
        public string id { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public Gender gender { get; set; }
        public string email { get; set; }

        public FacebookPicture picture { get; set; }

        public class FacebookPicture
        {
            public FacebookPictureData data { get; set; }
        }

        public class FacebookPictureData
        {
            public bool is_silhouette { get; set; }
            public string url { get; set; }
        }
    }
}

