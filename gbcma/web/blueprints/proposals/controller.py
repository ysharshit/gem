from flask import jsonify

from gbcma.web.blueprints.crud_controller import CrudController


class ProposalsController(CrudController):
    def __init__(self, repository):
        super().__init__(repository, namespace="proposals")
        self._columns = ["title"]

    def search(self, request):
        term = request.args.get("term")
        data = self._repository.search({"title": {"$regex": term, "$options": "i"}})
        result = map(lambda x: {"title": x["title"], "key": str(x["_id"])}, data)
        return jsonify(list(result))

    def _form_to_dict(self, form, d):
        d.update({
            "title": form.get("title", None),
            "content": form.get("content", None)
        })
        return d