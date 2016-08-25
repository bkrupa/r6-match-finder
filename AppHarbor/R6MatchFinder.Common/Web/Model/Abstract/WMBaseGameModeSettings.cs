namespace R6MatchFinder.Common.Web.Model.Abstract
{
    public abstract class WMBaseGameModeSettings
    {
        public string Id { get; set; }


        public int PreparationPhaseDuration { get; set; }
        public int ActionPhaseDuration { get; set; }


        public bool HostageDeath { get; set; }


        public int SecureTimeLimit { get; set; }
        public int UnsecureTimeLimit { get; set; }


        public int PlantDuration { get; set; }
        public int DefuseDuration { get; set; }
        public int FuseTime { get; set; }
        public bool DefuserCarrierSelection { get; set; }
    }
}
