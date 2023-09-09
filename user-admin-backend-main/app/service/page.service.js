import db from '../db/models';
import { CONTACT_PAGE } from '../constants/common.constant';

const { Op } = db.Sequelize;
/**
 * Get contact page
 * @param {*} query
 * @param {*} paging
 */
export function getContactPage() {
  return db.ContactPage.findAll();
}

/**
 * Get content page
 * @param {*} query
 * @param {*} paging
 */
 export function getContentPage({ pageCode }) {
  return db.ContentPage.findAll({
    where: { pageCode: pageCode }
  });
}

/**
 * Get slide page
 * @param {*} query
 * @param {*} paging
 */
 export function getSlidePage({ pageCode }) {
  return db.SlidePage.findAll({
    where: { pageCode: pageCode }

  });
}

/**
 * Update contact page
 * @param {*} body
 */
 export async function updateContactPage(body) {
  try {
    const infomationContact = await db.ContactPage.findOne({
      where: { type: CONTACT_PAGE.CONTRACT }
    })

    const infomationAddressFooter = await db.ContactPage.findOne({
      where: { type: CONTACT_PAGE.ADDRESS_FOOTER }
    })

    // Update or create infomation contact
    if (infomationContact) {
      db.ContactPage.update(body.infomationContact, {
        where: { type: CONTACT_PAGE.CONTRACT }
      });
    } else {
      db.ContactPage.create(body.infomationContact)
    }

    // Update or create infomation address footer
    if (infomationAddressFooter) {
      db.ContactPage.update(body.infomationAddressFooter, {
        where: { type: CONTACT_PAGE.ADDRESS_FOOTER }
      });
    } else {
      db.ContactPage.create(body.infomationAddressFooter)
    }

    return true;
  } catch (e) {
    console.log("ERROR_UPDATE_CONTACT_PAGE: ", e);
    throw e;
  }
}

/**
 * Update content slide page
 * @param {*} body
 */
 export async function updateContentSlidePage(body) {
  try {
    if (body.listContent) {
      for (const content of body.listContent) {
        const contentPage = await db.ContentPage.findOne({
          where: { pageCode: content.pageCode }
        })
        // Update or create infomation contact
        if (contentPage) {
          db.ContentPage.update(content, {
            where: { pageCode: content.pageCode }
          });
        } else {
          db.ContentPage.create(content);
        }
      }
    }

    if (body.listImage) {
      for (const image of body.listImage) {
        await db.SlidePage.destroy({ where: { pageCode: image.pageCode } });
      }
      for (const imageCreate of body.listImage) {
        await db.SlidePage.create(imageCreate);
      }
    }
    return true;
  } catch (e) {
    console.log("ERROR_UPDATE_CONTACT_PAGE: ", e);
    throw e;
  }
}
