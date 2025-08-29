
class ClientPlanningConfigMapper(object):

    @staticmethod
    def get_filter_dict(user, db_dict):
        filter_dict = dict(
            tenant=db_dict.get('tenant') or user.tenant,
            partition=db_dict.get('partition') or user.partition
        )

        return filter_dict
